import { KEYS, listenForMessage } from "@/modules/message";
import { ChatBot } from '../modules/chetGPTWebApis';

console.log('service-worker running...', Date.now());

let chatBot = new ChatBot(ChatBot.botRegistry.COMMON);

chrome.runtime.onInstalled.addListener(() => {
});

chrome.tabs.onUpdated.addListener(async (tabId, info, tab) => {
  if (!tab.url) return;

  const path = 'views/sidepanel.html';
  const url = chrome.runtime.getURL(path);

  if (tab.url.startsWith(url)) {
    chrome.sidePanel.setOptions({
      tabId,
      enabled: false
    });
  } else {
    chrome.sidePanel.setOptions({ 
      path: 'views/sidepanel.html',
      enabled: true
    });
  }
});

listenForMessage((message, sender, sendResponse) => {
  const {key, data} = message || {};
  switch (key) {
    case KEYS.CHAT_GPT_TRANSFORM:
      chatBot.chat(data).then(res => {
        sendResponse({ code: 0, data: res});
      }).catch(err => {
        sendResponse({ code: 1, msg: err.message});
      });
      return true;
  }
  return false;
});