import { useRefs } from "@/utils/refs";
import { ChatBot } from "@/modules/chetGPTWebApis";

const bot = new ChatBot();
const initPromise = bot.initConversation();

window.addEventListener('load', async () => {
  const refs = window['refs'] = useRefs();

  function resizeInput () {
    const el = refs.chatInput;
    el.style.height = 0;
    el.style.height = el.scrollHeight + 'px';
    el.scrollTop = el.scrollHeight;
  }

  refs.chatInput.addEventListener('keydown', ev => {
    const value = refs.chatInput.value;
    if (ev.key === 'Enter') {
      if (ev.isComposing || ev.keyCode === 229) {
        resizeInput();
        return;
      } else {
        if (ev.metaKey || ev.ctrlKey) {
          refs.chatInput.value += '\n';
          resizeInput()
          return;
        } else {
          ev.preventDefault();
        }
      }
  
      if (!value.trim()) return;
      refs.chatInput.value = null;
  
      const input = document.createElement('p');
      input.innerText = value;
      refs.chatContent.append(input);
  
      const el = document.createElement('p');
      el.classList.add('inprogress');
      refs.chatContent.append(el);
  
      if (!bot.ready) {
        return alert('稍等，会话初始化中...');
      }
  
      console.log('post message:', value);
  
      bot.chat(value, (msg) => {
        el.innerText = msg;
      }).then(res => {
        el.classList.remove('inprogress');
      });
    } 
    resizeInput();
  });

  initPromise.then(() => {
    bot.messageList.forEach(item => {
      if (item.message) {
        const el = document.createElement('p');
        el.innerText = item.message.content.parts.join('');
        refs.chatContent.append(el);
      }
    });
  })
});