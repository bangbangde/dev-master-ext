import { useStorageCache } from "@/modules/storage";

console.log(new Date().toLocaleString(), 'service-worker running...');

const storageCache = useStorageCache();

chrome.runtime.onInstalled.addListener(() => {
  console.log('runtime.onInstalled');
});

chrome.tabs.onUpdated.addListener(async (tabId, info, tab) => {
  console.log('tabs.onUpdated', {info});
});
