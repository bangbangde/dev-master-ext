import "../modules/action.js";
import "../modules/contextMenus.js";


chrome.runtime.onInstalled.addListener(() => {
  chrome.action.setBadgeText({text: 'inst'});
});