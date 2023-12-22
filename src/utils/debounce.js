export function debounce(fn, wait = 800, immediate = false) {
  let timer = null;
  let lastArgs = null;
  let lastThis = null;

  function invokeFn () {
    fn.apply(lastThis, lastArgs);
  }

  function startTimer() {
    timer = setTimeout(() => {
      timer = null;
      if (!immediate) {
        invokeFn();
      }
    }, wait);
  }

  return function(...args) {
    lastArgs = args;
    lastThis = this;

    if (timer) {
      clearTimeout(timer);
      startTimer();
      return;
    }

    if (immediate) {
      invokeFn();
    }

    startTimer();
  }
}