export class Resizable extends HTMLElement {
  constructor() {
    super();
    const shadow = this.attachShadow({mode: 'closed'});
    shadow.innerHTML = `
      <style>
        :host { position: fixed; border: 1px solid gainsboro; }
        .ctrl-bar { position: absolute; background: transparent; }
        #left, #right { cursor: col-resize; width: 2px; height: 100%; top: 0; }
        #top, #bottom { cursor: row-resize; width: 100%; height: 2px; left: 0; }
        #left { left: -1px; }
        #right { right: -1px; }
        #top { top: -1px; }
        #bottom { bottom: -1px; }
      </style>
      <div class="ctrl-bar" id="left"></div>
      <div class="ctrl-bar" id="top"></div>
      <div class="ctrl-bar" id="right"></div>
      <div class="ctrl-bar" id="bottom"></div>
      <slot></slot>
    `;
    shadow.querySelectorAll('.ctrl-bar').forEach(el => {
      el.addEventListener('mousedown', (mouseDownEvent) => {
        const rect = this.getBoundingClientRect();
        const barId = mouseDownEvent.target.id;
        console.log(barId, rect);
        
        const mousemove = (mouseMoveEvent) => {
          mouseMoveEvent.preventDefault();
          let diff;
          switch (barId) {
            case 'left':
              diff = mouseMoveEvent.clientX - mouseDownEvent.clientX;
              this.style.left = rect.x + diff + 'px';
              this.style.width = rect.width - diff + 'px';
              break;
            case 'right':
              diff = mouseMoveEvent.clientX - mouseDownEvent.clientX;
              this.style.width = rect.width + diff + 'px';
              break;
            case 'top':
              diff = mouseMoveEvent.clientY - mouseDownEvent.clientY;
              this.style.top = rect.y + diff + 'px';
              this.style.height = rect.height - diff + 'px';
              break;
            case 'bottom':
              diff = mouseMoveEvent.clientY - mouseDownEvent.clientY;
              this.style.height = rect.height + diff + 'px';
              break;
          }
        }
        
        const mouseup = (ev) => {
          document.removeEventListener('mousemove', mousemove);
          document.removeEventListener('mouseup', mouseup);
          ev.preventDefault();
        }

        document.addEventListener('mousemove', mousemove);
        document.addEventListener('mouseup', mouseup);

        mouseDownEvent.preventDefault();
      })
    });
  }
}

customElements.define('c-resizable', Resizable);