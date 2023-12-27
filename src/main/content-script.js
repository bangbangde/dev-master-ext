const options = {}

const logger = {
  log: (...args) => options?.['allowLogger'] && console.log(...args)
}

chrome.storage.local.get('OPTIONS').then((items) => {
  Object.assign(options, items['OPTIONS'])
})
chrome.storage.local.onChanged.addListener((changes, area) => {
  logger.log('storage.local.onChanged', changes, area)
  if (changes['OPTIONS']) {
    Object.assign(options, changes['OPTIONS'].newValue)
  }
})

function createScript({ type = 'module', src, code, append = true }) {
  const script = document.createElement('script')
  script.type = type
  if (src) {
    script.src = src
  } else {
    script.innerHTML = code
  }
  append && document.body.append(script)
  return script
}

const connect = (function useConnect(onMessage) {
  let port
  let connected = false

  function connect() {
    port = chrome.runtime.connect()
    logger.log('ext connect', { lastError: chrome.runtime.lastError })
    if (chrome.runtime.lastError) {
      throw chrome.runtime.lastError
    } else {
      port.onMessage.addListener(onMessage)
      port.onDisconnect.addListener(onDisconnect)
      connected = true
    }
  }
  function onDisconnect() {
    logger.log('ext onDisconnect', { lastError: chrome.runtime.lastError })
    connected = false
    if (!chrome.runtime.lastError) {
      connect()
    }
  }

  connect()

  return {
    get port() {
      return port
    },
    get disconnected() {
      return connected
    },
    postMessage(type, payload) {
      if (!connected) {
        connect()
      }
      try {
        port.postMessage({ type, payload })
      } catch (e) {
        connect()
        port.postMessage({ type, payload })
      }
    }
  }
})((message, port) => {
  logger.log('ext onMessage', message)
  if (message.type === 'INJECT_SCRIPT_TO_HOST') {
    createScript(message.payload)
  }
})
