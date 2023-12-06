import { getRefs } from "@/utils/refs";
import * as api from "@/modules/chetGPTWebApis";
import { STORAGE_KEY } from "@/modules/consts";

const initPrompt = '请你扮演一个精通英语的前端开发者，为我提供翻译、函数命名、英文润色等帮助。'

window.addEventListener('load', async () => {
  const refs = window['refs'] = getRefs();

  refs.chatInput.addEventListener('keydown', ev => {
    const value = refs.chatInput.value;

    if (ev.key === 'Enter') {
      console.table(ev.isComposing, ev.keyCode);

      if (ev.isComposing || ev.keyCode === 229) {
        return;
      } else {
        ev.preventDefault();
      }

      if (!value.trim()) return;
      refs.chatInput.value = null;

      const input = document.createElement('p');
      input.innerText = value;
      refs.chatContent.append(input);

      const el = document.createElement('p');
      refs.chatContent.append(el);
      // api.postMessage(value, (data) => {
      //   const msg = data.message.content.parts.join('');
      //   el.innerText = msg + '...';
      // }, conversation.id, conversation.currentNode).then(res => {
      //   conversation.currentNode = res[res.length - 1]['message_id'];
      // })
    }
  });

  const conversation = await initConversation();
  conversation && conversation.list.forEach(item => {
    if (item.message) {
      const el = document.createElement('p');
      el.innerText = item.message.content.parts.join('');
      refs.chatContent.append(el);
    }
  })
});

async function initConversation() {
  const conversationId = (await chrome.storage.local.get())?.[STORAGE_KEY.CONVERSATION_ID]; 

  if (conversationId) {
    const target = await api.queryConversations()
       .then(res => res.json())
       .then(async data => data.items.find(v => v.id === conversationId));

    if (target) {
      const detail = (await (await api.queryConversation(conversationId)).json());
      const list = [];
      (function unshiftMsg(id) {
        const target = detail.mapping[id];
        list.unshift(target);
        if (target.parent) {
          unshiftMsg(target.parent)
        }
      })(detail.current_node);

      return {
        id: conversationId,
        currentNode: detail.current_node,
        list
      }
    }
  }

  if (!confirm('是否要新建会话？')) {
    return null;
  }
  
  return api.postMessage(initPrompt).then(res => {
    if (!res) throw new Error('init failed');
    const info = res[res.length - 1];
    chrome.storage.local.set({[STORAGE_KEY.CONVERSATION_ID]: info.conversation_id});
    return {
      id: info.conversation_id,
      currentNode: info.message_id,
      list: [
        initPrompt,
        res[res.length - 2]
      ]
    }
  });
}