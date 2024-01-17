import * as Api from './chetGPTWebApis'
import { STORAGE_KEY } from '@/modules/consts'

let conversationId = null
let currentNode = null
let rootNode = null
let messageMapping = null
let readyPromise
let responding = false
let status = { ready: false, value: '' }
const statusListeners = new Set()
const pendingChatList = []
const title = '[EXT] DO NOT DELETE'
const initialPrompt = "Let's continue in Chinese."

function setStatus(value) {
  status = { value, ready: value === '初始化完成' }
  statusListeners.forEach((cb) => cb(status))
}

async function initConversation() {
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
      const res = await Api.postMessage(Api.buildMessage(initialPrompt))
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

const chat = async (msg, options = {}) => {
  const { onMessage, onSend } = options
  await readyPromise

  const post = (reject, resolve) => {
    const msgObj = Api.buildMessage(msg, conversationId, currentNode)
    const id = msgObj.messages[0].id

    messageMapping[id] = {
      id,
      message: msgObj.messages[0],
      parent: currentNode
    }

    const parentNode = messageMapping[currentNode]

    if (parentNode.children) {
      parentNode.children.push(id)
      parentNode.activeNode = id
    } else {
      messageMapping[currentNode].children = [id]
    }

    onSend && onSend(messageMapping[id])

    let node

    return Api.postMessage(msgObj, (msg, data) => {
      if (!node) {
        node = messageMapping[data.message.id] = {
          id: data.message.id,
          message: data.message,
          parent: id
        }
        messageMapping[id].children = [data.message.id]
        currentNode = node.id
      } else {
        node.message = data.message
      }
      onMessage(node)
    })
      .then((res) => {
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

function setCurrentNode(id) {
  currentNode = id?.id || id
}

function switchMessage(id) {
  function getLastNode(node) {
    if (node?.children?.length) {
      return getLastNode(
        messageMapping[node?.children[node?.children.length - 1]]
      )
    }
    return node
  }

  const lastNode = getLastNode(messageMapping[id])
  setCurrentNode(lastNode)
}

function getMessageList() {
  const list = []
  function walk(node) {
    list.unshift(node)
    if (!node.parent) return

    const parent = messageMapping[node.parent]
    parent.activeNode = node.id
    walk(parent)
  }
  walk(messageMapping[currentNode])

  return list
}

export const getChatBot = (options = {}) => {
  const { onStatusChange } = options
  if (onStatusChange) {
    statusListeners.add(onStatusChange)
    onStatusChange(status)
  }
  if (readyPromise === undefined) {
    readyPromise = initConversation()
  }
  return {
    chat,
    get messageMapping() {
      return messageMapping
    },
    get status() {
      return status
    },
    setCurrentNode,
    switchMessage,
    getMessageList
  }
}

chrome.storage.local.onChanged.addListener((items) => {
  if (items[STORAGE_KEY.CHAT_GPT_WEB_TOKEN]) {
    Api.setToken(items[STORAGE_KEY.CHAT_GPT_WEB_TOKEN].newValue)
  }
})
