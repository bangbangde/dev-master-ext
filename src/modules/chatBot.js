import * as Api from './chetGPTWebApis'
import { STORAGE_KEY } from '@/modules/consts'

let conversationId = null
let currentNode = null
let messageMapping = null
let readyPromise
let responding = false
let pendingChatList = []
let status = { ready: false, value: '' }
const statusListeners = new Set()
const initialPrompt =
  'I want you to act as a ChatGPT prompt generator, I will send a topic, you have to generate a ChatGPT prompt based on the content of the topic, the prompt should start with "I want you to act as ", and guess what I might do, and expand the prompt accordingly Describe the content to make it useful.Let\'s continue in Chinese.'

function setStatus(value) {
  status = { value, ready: value === '初始化完成' }
  statusListeners.forEach((cb) => cb(status))
}

async function initConversation(title = '[EXT] DO NOT DELETE') {
  try {
    setStatus('正在初始化token')
    const token = (
      await chrome.storage.local.get(STORAGE_KEY.CHAT_GPT_WEB_TOKEN)
    )?.[STORAGE_KEY.CHAT_GPT_WEB_TOKEN]

    if (!token) {
      setStatus('错误：token未设置')
      throw new Error('Failed to retrieve Authorization.')
    }

    Api.setToken(token)
    setStatus('token设置成功')

    setStatus('正在查询会话列表')
    const conversations = await Api.queryConversations().then((res) =>
      res.json()
    )
    const foundConv = conversations.items.find((v) => v.title === title)

    if (foundConv) {
      conversationId = foundConv.id
      setStatus('正在恢复会话')
    } else {
      setStatus('正在创建新会话')
      const res = await Api.postMessage(initialPrompt)
      conversationId = res.data[res.data.length - 1].conversation_id
      setStatus('正在设置会话标题')
      await Api.renameConversation(conversationId, title)
    }

    setStatus('正在读取会话信息')
    const convDetail = await Api.queryConversation(conversationId).then((res) =>
      res.json()
    )
    currentNode = convDetail['current_node']
    messageMapping = convDetail['mapping']
    setStatus('初始化完成')
  } catch (e) {
    setStatus(`初始化失败`)
    console.error(e)
  }
}

const chat = async (msg, onMessage) => {
  await readyPromise

  const post = (reject, resolve) => {
    return Api.postMessage(msg, onMessage, conversationId, currentNode)
      .then((res) => {
        const lastNode = res.data[res.data.length - 1]
        currentNode = lastNode['message_id'] || lastNode.message.id
        resolve && resolve(res)
        return res
      })
      .catch((err) => {
        if (reject) {
          reject(err)
        } else {
          throw err
        }
      })
      .finally(() => {
        if (pendingChatList?.length) {
          pendingChatList.shift()()
        } else {
          responding = false
        }
      })
  }

  if (responding) {
    return new Promise((resolve, reject) => {
      pendingChatList.push(post.bind(null, resolve, reject))
    })
  }

  responding = true
  return post()
}

export const getChatBot = (statusListener) => {
  if (statusListener) {
    statusListeners.add(statusListener)
  }
  if (readyPromise === undefined) {
    readyPromise = initConversation()
  }
  return {
    chat,
    get status() {
      return status
    },
    get messages() {
      if (!currentNode || !messageMapping) return null

      const list = []

      ;(function unshiftMsg(id) {
        const target = messageMapping[id]
        list.unshift(target)
        if (target.parent) {
          unshiftMsg(target.parent)
        }
      })(currentNode)

      return list
    }
  }
}

chrome.storage.local.onChanged.addListener((items) => {
  if (items[STORAGE_KEY.CHAT_GPT_WEB_TOKEN]) {
    Api.setToken(items[STORAGE_KEY.CHAT_GPT_WEB_TOKEN].newValue)
  }
})
