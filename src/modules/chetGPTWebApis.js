import merge from 'deepmerge'
import { generateUUID } from '@/utils/uuid'

let Authorization

/**
 * @param {string} urlString
 * @param {object} options
 */
const request = async (urlString, options) => {
  const baseurl = 'https://chat.openai.com/backend-api/'
  const url = new URL(baseurl + urlString)
  if (options.params) {
    url.search = new URLSearchParams(options.params).toString()
  }

  return fetch(
    url,
    merge(
      {
        headers: {
          Authorization: Authorization,
          'Content-Type': 'application/json'
        }
      },
      options
    )
  ).then((response) => {
    if (response.ok) {
      return response
    }
    return response.json().then((data) => {
      throw new Error(data.detail)
    })
  })
}

export const queryConversations = () => {
  return request('conversations', {
    method: 'GET',
    params: {
      offseet: '0',
      limit: '28',
      order: 'updated'
    }
  })
}

export const queryConversation = (id) => {
  return request(`conversation/${id}`, {
    method: 'GET'
  })
}

export const renameConversation = (id, title) => {
  return request(`conversation/${id}`, {
    method: 'PATCH',
    body: JSON.stringify({
      title
    })
  })
}

export const buildMessage = (message, conversationId, parentMessageId) => {
  if (parentMessageId == null) {
    parentMessageId = generateUUID()
  }
  return {
    action: 'next',
    messages: [
      {
        id: generateUUID(),
        author: { role: 'user' },
        content: {
          content_type: 'text',
          parts: [message]
        },
        metadata: {}
      }
    ],
    conversation_id: conversationId,
    parent_message_id: parentMessageId,
    model: 'text-davinci-002-render-sha',
    timezone_offset_min: -480,
    suggestions: [],
    history_and_training_disabled: false,
    arkose_token: null,
    conversation_mode: { kind: 'primary_assistant' },
    force_paragen: false,
    force_rate_limit: false
  }
}

/**
 *
 * @param {object} msg
 * @param {function} [cb]
 * @returns
 */
export const postMessage = async (msg, cb) => {
  return request(`conversation`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(msg)
  }).then(async (response) => {
    const reader = response.body.getReader()
    let data = []
    let message = ''

    async function processText(res) {
      if (res.done) return

      const text = new TextDecoder('utf-8').decode(res.value)

      // console.log('reader text:', text);

      text.split('\n').forEach((str) => {
        str = str.substring(6)
        try {
          if (str === '[DONE]') return
          const obj = JSON.parse(str)
          message = obj.message.content.parts.join('')
          data.push(obj)
          cb && cb(message, obj)
        } catch (e) {
          // console.error('processText', e);
        }
      })

      await reader.read().then(processText)
    }
    await reader.read().then(processText)

    return {
      data,
      message
    }
  })
}

export const setToken = (token) => {
  Authorization = token
}
