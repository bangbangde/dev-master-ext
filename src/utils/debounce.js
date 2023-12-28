/**
 * 定制防抖函数
 * - 等待时间内不会执行函数调用，但每次调用都会刷新等待时间
 * - 此函数保证最后一次调用一定会被执行。
 *
 * ps: 与节流函数的区别，就是【节流函数不会每次调用都会刷新等待时间】
 */
export function debounce(fn, wait = 800, immediate = false) {
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
