/**
 *
 * @type {{
 *   allowLogger: boolean
 *   chatGPTWebToken: string
 * }} OPTIONS
 */

export const STORAGE_KEY = {
  CHAT_GPT_WEB_TOKEN: 'CHAT_GPT_WEB_TOKEN',
  CHAT_GPT_CACHE: 'CHAT_GPT_CACHE',
  OPTIONS: 'OPTIONS'
}

export const CONNECT_NAME = {
  CONTENT_SCRIPT__SERVICE_WORKER: 'CONTENT_SCRIPT__SERVICE_WORKER',
  SIDE_PANEL__SERVICE_WORKER: 'SIDE_PANEL__SERVICE_WORKER'
}

export const MESSAGE_TYPE = {
  PING: 'PING',
  PONG: 'PONG',
  RESPONSE: 'RESPONSE',
  SERVICE_WORKER_RUNNING: 'SERVICE_WORKER_RUNNING'
}
