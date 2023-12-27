import { generateUUID } from '@/utils/uuid'

/**
 * 自动重连
 * @param {string} name
 * @param {(message: any, port: chrome.runtime.Port) => void} [onMessage]
 */
export const useConnect = (name, onMessage) => {
  let port

  function onDisconnect() {
    if (!chrome.runtime.lastError) {
      connect()
    }
  }

  function connect() {
    port = chrome.runtime.connect(null, { name })
    if (chrome.runtime.lastError) {
      throw chrome.runtime.lastError
    } else {
      port.onMessage.addListener(onMessage)
      port.onDisconnect.addListener(onDisconnect)
    }
  }

  connect()
  return {
    postMessage: (type, payload) => {
      const id = generateUUID()
      port.postMessage({
        type,
        id,
        payload
      })
      return id
    },
    get port() {
      return port
    }
  }
}

export default {
  useConnect
}
