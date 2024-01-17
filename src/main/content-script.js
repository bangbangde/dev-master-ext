function debounce(fn, wait = 800, immediate = false) {
  let timer = null
  let lastArgs = null
  let lastThis = null

  function invokeFn() {
    fn.apply(lastThis, lastArgs)
  }

  function startTimer(executed) {
    timer = setTimeout(() => {
      timer = null
      if (!executed) {
        invokeFn()
      }
    }, wait)
  }

  return function (...args) {
    lastArgs = args
    lastThis = this

    if (timer) {
      clearTimeout(timer)
      startTimer(false)
      return
    }

    if (immediate) {
      invokeFn()
      startTimer(true)
    } else {
      startTimer(false)
    }
  }
}

function addSelectionChangeListener(callback, wait = 800) {
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

addSelectionChangeListener(async (selection) => {
  await chrome.runtime.sendMessage({
    type: 'CONTENT_SCRIPT_SELECTION_TEXT',
    payload: selection.toString()
  })
})
