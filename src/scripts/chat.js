import { getRefs } from "@/utils/refs";
import { ChatBot } from "@/modules/chetGPTWebApis";

const bot = new ChatBot();
const initPromise = bot.initConversation();

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
      el.classList.add('inprogress');
      refs.chatContent.append(el);

      if (!bot.ready) {
        return alert('稍等，会话初始化中...');
      }

      bot.chat(value, (msg) => {
        el.innerText = msg;
      }).then(res => {
        el.classList.remove('inprogress');
      })
    }
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