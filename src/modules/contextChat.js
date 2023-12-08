function createDialog() {
  const wrap = document.createElement('div');
  const id = 'id_' + Math.random().toString(32).substring(2);
  wrap.innerHTML = /**html*/`
    <style>
      #${id} {
        position: fixed;
        left: 50%;
        top: 50%;
        width: 100px;
        height: 100px;
        background: red;
      }
      #${id}:focus {
        outline: none;
      }
    </style>
    <div id="${id}" tabindex="0">dialog</div>
  `;
  wrap.addEventListener('blur', ev => {
    console.log('blur');
    // wrap.remove();
  });
  document.documentElement.append(wrap);
  wrap.focus();
}

window.addEventListener('load', () => {
  createDialog();
})

