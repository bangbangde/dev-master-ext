import { ChatBot } from "./chetGPTWebApis";

function createMenus() {
  let parent = chrome.contextMenus.create({
    title: 'ChatBot',
    contexts: ['selection'],
    id: 'ChatBot'
  });

  Object.entries(ChatBot.botRegistry).forEach(([k, v]) => {
    chrome.contextMenus.create({
      contexts: ['selection'],
      title: v.title,
      parentId: parent,
      id: k
    });
  });
}

async function genericOnClick(info, tab) {
  if (info.parentMenuItemId === 'ChatBot') {
    chrome.tabs.sendMessage(tab.id, 'hi')
      .then(res => {
        console.log({res});
      });
  }
}

// chrome.contextMenus.onClicked.addListener(genericOnClick);
// chrome.runtime.onInstalled.addListener(createMenus);