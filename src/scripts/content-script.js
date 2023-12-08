const looger = console.log.bind(null, '[content script]');

looger('content script running');

window.addEventListener('load', () => {
  looger('load');
});

window.addEventListener('message', ev => {
  looger('on message', ev.data, ev.origin);
});

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  looger('chrome.runtime.onMessage', {request, sender});
  // @ts-ignore
  sendResponse({ ok: 1 });
  return false;
});