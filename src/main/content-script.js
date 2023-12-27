function createScript({type = 'module', src, code, append = true}) {
  const script = document.createElement('script');
  script.type = type;
  if (src) {
    script.src = src;
  } else {
    script.innerHTML = code;
  }
  append && document.body.append(script);
  return script;
}

// @ts-ignore
let port = chrome.runtime.connect({name: 'content-script'});
port.onDisconnect.addListener(() => {
  
})