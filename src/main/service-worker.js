import { CONNECT_NAME, MESSAGE_TYPE } from '@/modules/consts'
import { generateUUID } from '@/utils/uuid'

const portsMap = new Map()

console.log(new Date().toLocaleString(), 'service-worker running...')

portsMap.get(CONNECT_NAME.CONTENT_SCRIPT__SERVICE_WORKER)?.postMessage({
  type: MESSAGE_TYPE.SERVICE_WORKER_RUNNING
})

chrome.runtime.onInstalled.addListener(() => {
  console.log('runtime.onInstalled')
})

chrome.tabs.onUpdated.addListener(async (tabId, info, tab) => {
  // console.log('tabs.onUpdated', { info })
})

chrome.runtime.onConnect.addListener((port) => {
  port.name && portsMap.set(port.name, port)
  port.onDisconnect.addListener((port) => {
    port.name && portsMap.delete(port)
  })
  port.onMessage.addListener((message, port) => {
    switch (message.type) {
      case MESSAGE_TYPE.PING:
        port.postMessage({ type: MESSAGE_TYPE.PONG })
        return
    }
  })
})
