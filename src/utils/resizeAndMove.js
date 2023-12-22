export function addMoveController(anchor, target, mode = 'position', preventDefault = true) {
  function handleMouseDown(ev) {
    const diffX = ev.offsetX;
    const diffY = ev.offsetY;
    const originX = ev.clientX;
    const originY = ev.clientY;
    const {m41, m42} = new DOMMatrix(target.style.transform);
    let pointerEvents = target.style.pointerEvents;

    function handleMouseMove(ev) {
      const {clientX, clientY} = ev;
      if (mode === 'position') {
        target.style.left = clientX - diffX + 'px';
        target.style.top = clientY - diffY + 'px';
      } else {
        target.style.transform = `translate(${m41 + clientX - originX}px, ${m42 + clientY - originY}px)`;
      }
      target.style.pointerEvents = 'none';
      ev.preventDefault();
    }

    function handleMouseUp(ev) {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      target.style.pointerEvents = pointerEvents;
    }

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
    
    ev.preventDefault();
  }

  anchor.addEventListener('mousedown', handleMouseDown);

  return () => {
    anchor.removeEventListener('mousedown', handleMouseDown);
  }
}

export function createResizableContainer(className, style, element) {
  const container = document.createElement('div');
  container.className = className;
  Object.assign(container.style, style);
  const shadowRoot = container.attachShadow({mode: 'closed'});
  shadowRoot.innerHTML = `
        <style>
          :host {
              min-width: 80px;
              min-height: 80px;
              position: fixed;
              left: 0;
              top: 0;
              background: antiquewhite;
          }
          .line {
            position: absolute;
            background: red;
          }
          #left, #right {
            cursor: col-resize;
            width: 2px;
            height: 100%;
            top: 0;
          }
          #top, #bottom {
            cursor: row-resize;
            width: 100%;
            height: 2px;
            left: 0;
          }
          #left {
            left: 0;
          }
          #right {
            left: 100%;
          }
          #top {
            top: 0;
          }
          #bottom {
            top: 100%;
          }
        </style>
        <div class="line" id="left"></div>
        <div class="line" id="top"></div>
        <div class="line" id="right"></div>
        <div class="line" id="bottom"></div>
        <slot></slot>
      `;

  const lines = (function () {
    const obj = {};
    shadowRoot.querySelectorAll('.line').forEach(el => {
      obj[el.id] = el;
    });
    return obj;
  })();

  function setMoveListener(el, container, onMove) {
    function mousedown(mouseDownEvent) {
      const elRect = container.getBoundingClientRect();
      function mousemove(mouseMoveEvent) {
        onMove(elRect, mouseDownEvent, mouseMoveEvent);
        mouseMoveEvent.preventDefault();
      }
      function mouseup(ev) {
        document.removeEventListener('mousemove', mousemove);
        document.removeEventListener('mouseup', mouseup);
      }

      document.addEventListener('mousemove', mousemove);
      document.addEventListener('mouseup', mouseup);

      mouseDownEvent.preventDefault();
    }
    el.addEventListener('mousedown', mousedown);
  }

  setMoveListener(lines.left, container, (rect, down, move) => {
    const diff = move.clientX - down.clientX;
    container.style.left = rect.x + diff + 'px';
    container.style.width = rect.width - diff + 'px';
  });

  setMoveListener(lines.right, container, (rect, down, move) => {
    const diff = move.clientX - down.clientX;
    container.style.width = rect.width + diff + 'px';
  });

  setMoveListener(lines.top, container, (rect, down, move) => {
    const diff = move.clientY - down.clientY;
    container.style.top = rect.y + diff + 'px';
    container.style.height = rect.height - diff + 'px';
  });

  setMoveListener(lines.bottom, container, (rect, down, move) => {
    const diff = move.clientY - down.clientY;
    container.style.height = rect.height + diff + 'px';
  });

  element && container.append(element);
  return container;
}