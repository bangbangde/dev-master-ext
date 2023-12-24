import { listenForMessage } from "../modules/message.js";
import { useRefs } from "../utils/refs.js";

let refs;

function messageChatGPT() {
  const {inputMsg} = refs;
  const message = inputMsg.value;
  inputMsg.value = "";
  inputMsg.dispatchEvent(new InputEvent('input'));
  console.log(message);
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
  })
});
