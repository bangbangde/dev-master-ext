import { generateUUID } from "@/utils/uuid";

/**
 * 自动重连
 * @param {string} name 
 * @param {(message: any, port: chrome.runtime.Port) => void} [onMessage]
 */
export const useConnect = (name, onMessage) => {
  let port;
  let shouldRreconnect;
  const listeners = [];

  (function connect() {
    port = chrome.runtime.connect(null, { name });
    onMessage && port.onMessage.addListener(onMessage);
    listeners.forEach(fn => port.onMessage.addListener(fn));
    port.onDisconnect.addListener(function() {
      console.log("{${name}} Disconnected");
      shouldRreconnect && connect();
    });
    shouldRreconnect = true;
    console.log(shouldRreconnect ? `${name} Connected` : `${name} Reconnected`);
  })();

  return {
    addListener: (fn) => {
      listeners.push(fn);
      port.onMessage.addListener(fn);
    },
    /**
     * postMessage
     * @param {string} type 
     * @param {any} payload
     */
    postMessage: (type, payload) => {
      port.postMessage({
        type,
        id: generateUUID(),
        payload
      });
    },
    disconneect: () => {
      shouldRreconnect = false;
      port.disconneect();
    },
    get port() {
      return port;
    }
  }
}

export default {
  useConnect
};