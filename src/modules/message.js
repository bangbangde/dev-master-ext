export const KEYS = {
  CONTENT_SCRIPT_SELECTION: 'CONTENT_SCRIPT_SELECTION',
  CHAT_GPT_TRANSFORM: 'CHAT_GPT_TRANSFORM'
}

/**
 * 
 * @param {KEYS[keyof KEYS]} key 
 * @param {*} data 
 * @returns 
 */
export const sendMessage = async (key, data) => {
  return await chrome.runtime.sendMessage({
    key,
    data
  });
}

/**
 * 
 * @param {(message: any, sender: chrome.runtime.MessageSender, sendResponse: (msg: any) => void) => boolean} fn 
 * @returns 
 */
export const listenForMessage = (fn) => {
  chrome.runtime.onMessage.addListener(fn);
  return () => chrome.runtime.onMessage.removeListener(fn);
}