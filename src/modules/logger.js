import { STORAGE_KEY } from './consts'
let shouldPostLogs = false

;(async () => {
  const key = STORAGE_KEY.SHOULD_POST_LOGS
  shouldPostLogs = !!(await chrome.storage.local.get(key))?.[key]
  chrome.storage.local.onChanged.addListener((changes) => {
    if (changes[key]) {
      shouldPostLogs = changes[key].newValue
    }
  })
})()

export const log = (...args) => {
  console.log(...args)
}
