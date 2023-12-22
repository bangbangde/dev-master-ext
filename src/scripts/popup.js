import { useRefs } from "@/utils/refs";
let refs;

window.onload = () => {
  refs = useRefs();
  refs.btnOpenSidepanel.onclick = async () => {
    const tabs = await chrome.tabs.query({ active: true, currentWindow: true });
    const tabId = tabs[0].id;
    chrome.sidePanel.open({tabId}).catch(e => {});
  }
}