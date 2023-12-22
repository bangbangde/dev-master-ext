import merge from 'deepmerge';
import { useStorage } from "@/utils/useStorage";
import { STORAGE_KEY } from './consts';
import { generateUUID } from '@/utils/uuid';

let token = useStorage(STORAGE_KEY.CHAT_GPT_WEB_TOKEN, { watch: true });

/**
 * @param {string} urlString 
 * @param {object} options 
 */
const request = async (urlString, options) => {
  const baseurl = 'https://chat.openai.com/backend-api/';
  const Authorization = await token.then(v => v.value);
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
  }, options));
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

export const renameConversation = (id, title) => {
  return request(`conversation/${id}`, {
    method: 'PATCH',
    body: JSON.stringify({
      title
    })
  })
}

export const getReady = async (bot) => {

}

export class ChatBot {
  bot = null;
  conversationId = null;
  currentNode = null;
  messageMapping = null;
  ready = new Promise(() => {});

  constructor(bot) {
    this.bot = bot || ChatBot.botRegistry.COMMON;
    this.ready = this.update();
  }

  get messageList() {
    if (!this.currentNode || !this.messageMapping) return null;

    const list = [];
    const mapping = this.messageMapping;

    (function unshiftMsg(id) {
      const target = mapping[id];
      list.unshift(target);
      if (target.parent) {
        unshiftMsg(target.parent)
      }
    })(this.currentNode);
    
    return list;
  }

  async update() {
    const conversations = await queryConversations().then(res => res.json());
    const foundConv = conversations.items.find(v => v.title === this.bot.title);

    if (foundConv) {
      this.conversationId = foundConv.id;
    } else {
      const res = await postMessage(this.bot.initialPrompt);
      this.conversationId = res.data[res.data.length - 1].conversation_id;
      await renameConversation(this.conversationId, this.bot.title);
    }

    const convDetail = await queryConversation(this.conversationId).then(res => res.json());
    this.currentNode = convDetail['current_node'];
    this.messageMapping = convDetail['mapping'];
  }
  
  async chat(msg, onMessage) {
    return this.ready
      .catch(() => {})
      .then(() => postMessage(msg, onMessage, this.conversationId, this.currentNode))
      .then((res) => {
        const lastNode = res.data[res.data.length - 1];
        this.currentNode = lastNode['message_id'] || lastNode.message.id;
        return res;
      })
  }
}

ChatBot.botRegistry = {
  COMMON: {
    title: 'BOT_通用助手',
    initialPrompt: '请你扮演一个web开发助手'
  }
}