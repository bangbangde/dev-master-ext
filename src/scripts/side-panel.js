import { MESSAGE_TYPE } from "@/modules/consts.js";
import { useRefs } from "../utils/refs.js";

let refs;

let conversationId;

const templates = {
  translate: {
    fields: [
      {
        label: '翻译',
        name: '',
        type: 'select',
        initialValue: null,
        options: [ { label: '', value: '' } ]
      }
    ],
    
  }
}

// @ts-ignore
const port = chrome.runtime.connect({ name: "sidepanel" });
port.onMessage.addListener(function(message) {
    console.log(`Side panel received message from ${port.name}: ${JSON.stringify(message)}`);

    if (message.type === MESSAGE_TYPE.CHAT_GPT_CID) {
      conversationId = message.data;
      setLinkTochatGPT();
      return;
    }

    if (message.type === MESSAGE_TYPE.CHAT_GPT_RESPONDING) {
      refs.response.innerHTML = message.data;
      return;
    }
    if (message.type === MESSAGE_TYPE.CHAT_GPT_RESPONSE) {
      refs.response.classList.remove('responding');
      if (message.error) {
        refs.response.classList.add('error');
        refs.response.innerHTML = message.error;
      }
      return;
    }
});

function messageChatGPT() {
  if (refs.response.classList.contains('responding')) return;

  const {inputMsg} = refs;
  const message = inputMsg.value;
  if (message.trim() === '') return;

  inputMsg.value = "";
  inputMsg.dispatchEvent(new InputEvent('input'));

  port.postMessage({ type: MESSAGE_TYPE.CHAT_GPT_POST_MSG, data: message });
  refs.response.inneerHTML = '';
  refs.response.classList.add('responding');
  refs.response.classList.remove('error');
}

function setLinkTochatGPT() {
  if (!conversationId) return;
  let el = document.querySelector('[ref=linkTochatGPT]');
  if (!el) return;

  el.setAttribute('href', `https://chat.openai.com/c/${conversationId}`);
}

window.addEventListener('load', () => {
  refs = useRefs();
  const { inputWrap, templateContent, inputMsg, btnPost } = refs;
  
  inputMsg.addEventListener('input', () => {
    inputMsg.style.height = '1px';
    inputMsg.style.height = inputMsg.scrollHeight + 'px';
    inputMsg.scrollTop = inputMsg.scrollHeight;
  })

  inputMsg.addEventListener('keydown', ev => {
    if (ev.key === 'Enter') {
      if (ev.isComposing || ev.keyCode === 229) {
        return;
      }

      if (ev.metaKey || ev.ctrlKey) {
        ev.target.value += '\n';
        ev.target.dispatchEvent(new InputEvent('input'));
        return;
      }

      ev.preventDefault();
      messageChatGPT();
      return;
    }
  });
  
  btnPost.onclick = () => {
    messageChatGPT();
  };
  
  document.querySelectorAll('.tab').forEach(el => {
    el.addEventListener('click', ev => {
      if (ev.target.classList.contains('active')) return;
      
      const key = ev.target.dataset.key;
      document.querySelector('.active').classList.remove('active');
      ev.target.classList.add('active');
      
      if (key === 'chat') {
        inputWrap.classList.remove('hidden');
        templateContent.classList.add('hidden');
      } else {
        inputWrap.classList.add('hidden');
        templateContent.classList.remove('hidden');
      }
    })
  });

  setLinkTochatGPT();
});
