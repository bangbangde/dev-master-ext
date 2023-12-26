import { useStorageCache } from "@/modules/storage";

console.log(new Date().toLocaleString(), 'service-worker running...');

const storageCache = useStorageCache();

chrome.runtime.onInstalled.addListener(() => {
  console.log('runtime.onInstalled');
  chrome.notifications.create({
    type: "basic",
    title: "service-worker running...",
    message: "start time: " + new Date().toLocaleString(),
    iconUrl: "https://avatars.githubusercontent.com/u/16101554?v=4"
  });
});

chrome.tabs.onUpdated.addListener(async (tabId, info, tab) => {
  console.log('tabs.onUpdated', {info});
});
