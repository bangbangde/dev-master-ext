import { useRefs } from "@/utils/refs";
import { useStorage } from "@/utils/useStorage";
import { STORAGE_KEY } from "@/modules/consts";
let refs;

window.onload = () => {
  refs = useRefs();
  refs.btnOpenSidepanel.onclick = async () => {
    const tabs = await chrome.tabs.query({ active: true, currentWindow: true });
    const tabId = tabs[0].id;
    chrome.sidePanel.open({tabId}).catch(e => {});
  }

  function handleChatBotStatusChange(data) {
    if (data?.ready === false) {
      refs.chatBotStatus.style.display = 'block';
      refs.chatBotStatus.querySelector('.errMsg').innerHTML = `(${data.detail})`;
    } else {
      refs.chatBotStatus.style.display = 'none';
    }
  }

  useStorage(STORAGE_KEY.CHAT_BOT_STATUS, {
    onChange: handleChatBotStatusChange
  }).then(target => {
    handleChatBotStatusChange(target.value);
  });
}