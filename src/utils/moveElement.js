export function addMoveController(anchor, target, mode = 'position') {

  function handleMouseDown(ev) {
    const diffX = ev.offsetX;
    const diffY = ev.offsetY;
    const originX = ev.clientX;
    const originY = ev.clientY;
    
    const {m41, m42} = new DOMMatrix(window.getComputedStyle(target).getPropertyValue('transform'));
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
