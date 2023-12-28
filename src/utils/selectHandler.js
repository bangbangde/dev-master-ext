import { debounce } from './debounce.js'

export function addSelectionChangeListener(callback, wait = 800) {
  const handler = debounce(
    (ev) => {
      callback(window.getSelection())
    },
    wait,
    true
  )

  document.addEventListener('selectionchange', handler)
  return () => {
    document.removeEventListener('selectionchange', handler)
  }
}
