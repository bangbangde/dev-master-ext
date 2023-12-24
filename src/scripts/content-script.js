import * as FAB from "@/modules/selectionFAB";
import { KEYS, sendMessage } from "@/modules/message";
import {addMoveController} from "@/utils/moveElement";
const logger = console.log.bind(null, '[content script]');

function defineCustomElements() {
  const script = document.createElement("script");
  script.type = "module";
  script.src = chrome.runtime.getURL("scripts/Resizable.js");
  document.body.appendChild(script);
}

logger('v0.0.6');
defineCustomElements();

FAB.init((text, ev) => {
  const btn = ev.target;
  const dialog = document.createElement('c-resizable');
  dialog.style.left = btn.offsetLeft + 'px';
  dialog.style.top = btn.offsetTop + 'px';
  document.body.append(dialog);
  dialog.innerHTML = 'loading...'
  btn.remove();

  sendMessage(KEYS.CHAT_GPT_TRANSFORM, `请将这段文字翻译成中文：“${text}”`)
    .then(res => {
      if (res.code !== 0) throw new Error(res.msg);
      dialog.innerHTML = res.data.message;
    })
    .catch(err => {
      dialog.innerHTML = err.message || '未知错误';
    });
});