export function useRefs() {
  const refs = {};
  const refEls = document.querySelectorAll('[ref]');
  refEls.forEach(item => {
    const refName = item.getAttribute('ref');
    refs[refName] = item;
  })
  return refs;
}