import merge from 'deepmerge';
import { generateUUID } from '@/utils/uuid';
import { STORAGE_KEY } from './consts';

const storage = chrome.storage.local;

let getTokenPromise = storage.get(STORAGE_KEY.CHAT_GPT_WEB_TOKEN).then(data => data?.[STORAGE_KEY.CHAT_GPT_WEB_TOKEN]);

storage.onChanged.addListener(ev => {
  if (ev[STORAGE_KEY.CHAT_GPT_WEB_TOKEN]) {
    getTokenPromise = Promise.resolve(ev[STORAGE_KEY.CHAT_GPT_WEB_TOKEN].newValue);
  }
})

/**
 * @param {string} urlString 
 * @param {object} options 
 */
const request = async (urlString, options) => {
  const baseurl = 'https://chat.openai.com/backend-api/';
  const Authorization = await getTokenPromise;
  if (!Authorization) {
    throw new Error('Failed to retrieve Authorization.');
  }

  const url = new URL(baseurl + urlString);
  if (options.params) {
    url.search = new URLSearchParams(options.params).toString()
  }

  return fetch(url, merge({
    headers: {
      Authorization,
      'Content-Type': 'application/json'
    }
  }, options))
    .then(response => {
      if (response.ok) {
        return response;
      }
      return response.json().then(data => {throw new Error(data.detail)});
    });
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

/**
 * 
 * @param {string} message 
 * @param {function} [cb]
 * @param {string} [conversationId]
 * @param {string} [parentMessageId]
 * @returns 
 */
export const postMessage = async (message, cb, conversationId, parentMessageId) => {
  if (parentMessageId == null) {
    parentMessageId = generateUUID();
  }
  return request(`conversation`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      "action": "next",
      "messages": [
        {
          "id": generateUUID(),
          "author": { "role": "user" },
          "content": {
            "content_type": "text",
            "parts":[message]
          },
          "metadata":{}
        }
      ],
      "conversation_id": conversationId,
      "parent_message_id": parentMessageId,
      "model": "text-davinci-002-render-sha",
      "timezone_offset_min":-480,
      "suggestions":[],
      "history_and_training_disabled":false,
      "arkose_token":null,
      "conversation_mode":{"kind":"primary_assistant"},
      "force_paragen":false,
      "force_rate_limit":false
    })
  }).then(async response => {
    const reader = response.body.getReader();
    let data = [];
    let message = "";

    async function processText(res) {
      if (res.done) return;

      const text = new TextDecoder('utf-8').decode(res.value);

      // console.log('reader text:', text);

      text.split('\n').forEach(str => {
        str = str.substring(6);
        try {
          if (str === '[DONE]') return;
          const obj = JSON.parse(str);
          message = obj.message.content.parts.join('');
          data.push(obj);
          cb && cb(message, obj);
        } catch(e) {
          // console.error('processText', e);
        }
      });

      await reader.read().then(processText);
    }
    await reader.read().then(processText);

    console.log('conveersation done', {message, data});
    return {
      data,
      message
    };
  })
}
