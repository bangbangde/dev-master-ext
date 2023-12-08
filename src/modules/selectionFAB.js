export function createButton() {
  var selection = window.getSelection();
  if (selection && selection.rangeCount > 0) {
    var range = selection.getRangeAt(0);

    if (range.collapsed) {
      return
    };

    var keyRange = document.createRange();
    keyRange.setStart(range.endContainer, range.endOffset);
    keyRange.setEnd(range.endContainer, range.endOffset);

    /** @type {HTMLDivElement} */
    const faIcon = document.querySelector('.fa-icon') || document.createElement('div');
    faIcon.className = 'fa-icon';
    const {x, y, width, height} = keyRange.getBoundingClientRect();
    faIcon.style.left = x + width + 10 + 'px';
    faIcon.style.top = y + height + 10 + 'px';
    document.documentElement.append(faIcon);
  }
}

export function init () {
  document.addEventListener('mouseup', createButton);
  document.addEventListener('mousedown', () => {
    document.querySelector('.fa-icon')?.remove();
  });
  return () => document.removeEventListener('mouseup', createButton);
}

window.addEventListener('load', init);