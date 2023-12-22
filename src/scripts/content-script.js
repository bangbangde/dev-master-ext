import { init } from "@/modules/selectionFAB";
import { KEYS, sendMessage } from "@/modules/message";
import {addMoveController, createResizableContainer} from '../utils/resizeAndMove';
const logger = console.log.bind(null, '[content script]');

logger('v0.0.6');

function createDialog(x = 0, y = 0) {
  const dialog = createResizableContainer('dialog resizable', {
    left: x + 'px',
    top: y + 'px'
  });

  const container = document.createElement('div');
  const shadowRoot = container.attachShadow({mode: 'open'});
  shadowRoot.innerHTML =
    `
        <style>
        :host {
          width: 100%;
          height: 100%;
          display: flex;
          flex-direction: column;
        }
        .head {
            height: 16px;
            background: gainsboro;
        }
        .body {
            flex: 1 1 auto;
            padding: 16px;
        }
        </style>
        <div class="head"></div>
        <div class="body"></div>
      `;

  const head = shadowRoot.querySelector('.head');
  const body = shadowRoot.querySelector('.body');

  addMoveController(head, dialog, 'transform');
  dialog.append(container);
  dialog.setAttribute('tabindex', -1);
  dialog.addEventListener('blur', (ev) => ev.target.remove())

  document.documentElement.append(dialog);

  return {
    target: dialog,
    setContent: content => body.innerHTML = content,
    close: () => dialog.remove()
  };
}

function FABClickListener(text, ev) {
  const btn = ev.target;
  const dialog = createDialog(btn.offsetLeft, btn.offsetTop);
  btn.remove();
  
  sendMessage(KEYS.CHAT_GPT_TRANSFORM, `请将这段文字翻译成中文：“${text}”`)
    .then(res => {
      console.log(res);
      if (res.code == 0) {
        dialog.setContent(res.data.message);
      } else {
        dialog.setContent(res.msg);
      }
    })
    .catch(err => {
      console.error(err);
    });
}

init(FABClickListener);