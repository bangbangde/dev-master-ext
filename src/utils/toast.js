function createToastElement(type, content) {
  const host = document.createElement('div')
  const shadow = host.attachShadow({ mode: 'closed' })
  shadow.innerHTML = `
    <style>
        :host {
            position: fixed;
            top: 32px;
            left: 50%;
            transform: translateX(-50%);
            max-width: 100%;
        }
        .content {
            background: #33333333;
            padding: 4px 12px;
            border-radius: 8px;
            font-size: 16px;
            color: #333333;
        }
    </style>
    <div class="content"><slot></slot></div>
  `
  const elContent = shadow.querySelector('.content')
  elContent.classList.add(type)
  elContent.append(content)
  return host
}

function show(el, timeout = 3000) {
  document.body.append(el)
  setTimeout(() => {
    el.remove()
  }, timeout)
}

export const Toast = (content, type = 'info') => {
  show(createToastElement(type, content))
}

export default Toast
