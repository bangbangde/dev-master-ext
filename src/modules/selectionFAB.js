const btnClass = 'fa-icon';
const initFlag = 'SELECTION_FAB_INSTALLED';

let _fabClickListener = () => {};

export function createButton({left, top, text}) {
  /** @type {HTMLDivElement} */
  const btn = document.createElement('div');
  btn.style.left = left;
  btn.style.top = top;
  const shadowRoot = btn.attachShadow({mode: 'closed'});
  shadowRoot.innerHTML = 
  /**html*/`
  <style>
    :host {
      position: fixed;
      width: 28px;
      height: 28px;
      border-radius: 8px;
      background-color: orange;
      text-align: center;
    }
    .content {
      color: white;
      font-size: 20px;
      line-height: 28px;
    }
  </style>
  <span class="content">译</span>
  `;
  btn.onclick = _fabClickListener.bind(null, text);
  document.documentElement.append(btn);
}

export function getSelectionInfo() {
  var selection = window.getSelection();
  if (selection && selection.isCollapsed) return null;

  const range = selection.getRangeAt(0);
  var keyRange = document.createRange();
  keyRange.setStart(range.endContainer, range.endOffset);
  keyRange.setEnd(range.endContainer, range.endOffset);
  const {x, y, width, height} = keyRange.getBoundingClientRect();

  return {
    left: x + width + 10 + 'px',
    top: y + height + 10 + 'px',
    text: selection.toString()
  }
}

export function init (fabClickListener) {
  _fabClickListener = fabClickListener;

  if (window[initFlag]) {
    return;
  }

  window[initFlag] = true;

  const handleMouseup = () => {
    const selection = getSelectionInfo();
    selection && createButton(selection);
  };

  const handleMousedown = (ev) => {
    const btn = document.querySelector(`.${btnClass}`);
    if (btn && btn !== ev.target) {
      btn.remove();
    }
  };

  document.addEventListener('mouseup', handleMouseup);
  document.addEventListener('mousedown', handleMousedown);

  return () => {
    document.removeEventListener('mouseup', handleMouseup);
    document.removeEventListener('mousedown', handleMousedown);
  }
}