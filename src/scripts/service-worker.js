import { ChatBot } from '../modules/chetGPTWebApis';
import { MESSAGE_TYPE } from "@/modules/consts";

console.log('service-worker running...', Date.now());

let chatBot = new ChatBot(ChatBot.botRegistry.COMMON);

chrome.runtime.onInstalled.addListener(() => {
  console.log('onInstalled', Date.now());
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

chrome.runtime.onConnect.addListener(function(port) {

  if (port.name === 'sidepanel') {
    port.onMessage.addListener(function(message) {
      console.log(`Received message from ${port.name}: ${JSON.stringify(message)}`);

      if (message.type === MESSAGE_TYPE.CHAT_GPT_POST_MSG) {
        chatBot.chat(message.data, (data) => {
          port.postMessage({ type: MESSAGE_TYPE.CHAT_GPT_RESPONDING, data });
        }).then(data => {
          port.postMessage({ type: MESSAGE_TYPE.CHAT_GPT_RESPONSE, data });
        }).catch(error => {
          port.postMessage({ type: MESSAGE_TYPE.CHAT_GPT_RESPONSE, error: error.message });
        })
        return;
      }
    });

    port.postMessage({ type: MESSAGE_TYPE.CHAT_GPT_CID, data: chatBot.conversationId });
  }
});