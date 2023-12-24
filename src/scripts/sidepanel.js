import { listenForMessage } from "@/modules/message";
import { useRefs } from "@/utils/refs";

let refs;

window.addEventListener('load', () => {
  refs = useRefs();
  refs.status.innerText = 'load';
  // refs.openInTab.onclick = () => {
  //   chrome.tabs.create({ url: '/views/sidepanel.html' });
  // }
});

const removeMessageListener = listenForMessage((msg, sender, sendResponse) => {
  refs.status.innerText = 'onMessage';
  if (refs?.selectionText) {
    refs.selectionText.innerText = msg.data;
  }
});