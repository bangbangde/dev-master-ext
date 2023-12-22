import { init } from "@/modules/selectionFAB";
import { KEYS, sendMessage } from "@/modules/message";
const looger = console.log.bind(null, '[content script]');

const template = document.createDocumentFragment();


looger('v0.0.6');

function FABClickListener(text, ev) {
  const btn = ev.target;
  const {offsetLeft, offsetTop} = btn;

  function createDialog(content) {
    const dialog = document.createElement('div');
    const shadowRoot = dialog.attachShadow({mode: 'closed'});
    shadowRoot.innerHTML =
    /**html*/`
      <style>
        :host {
          position: fixed;
          left: 0;
          top: 0;
          right: 0;
          bottom: 0;
        }
        .content {
          padding: 16px;
          background: white;
          border-radius: 8px;
          max-width: 300px;
          max-height: 500px;
          position: absolute;
          overflow: auto;
          left: ${offsetLeft}px;
          top: ${offsetTop}px;
        }
      </style>
      <p class="content loading">loading...</p>
    `;

    dialog.addEventListener('click', ev => {
      if (ev.target === ev.currentTarget) {
        dialog.remove();
        return;
      }
    })
    document.documentElement.append(dialog);

    return {
      setContent(content) {
        const innerDialog = shadowRoot.querySelector('p.content');
        innerDialog.classList.remove('loading');
        innerDialog.innerHTML = content;
      }
    }
  }

  btn.remove();
  const dialog = createDialog();
  sendMessage(KEYS.CHAT_GPT_TRANSFORM, `请将这段文字翻译成中文：“${text}”`)
    .then(res => {
      console.log(res);
      dialog.setContent(res.data.message);
    })
    .catch(err => {
      console.error(err);
    });
}

init(FABClickListener);