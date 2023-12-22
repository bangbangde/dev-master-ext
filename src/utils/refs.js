export function useRefs(name = 'ref', prefix = 'ref-') {
  const refs = {};
  const refEls = document.querySelectorAll(`.${name}`);
  refEls.forEach(item => {
    const refName = Array.from(item.classList).find(clazz => clazz.startsWith(prefix))
    const name = refName ? refName.substring(prefix.length) : null;
    if (name) {
      refs[name] = item;
    }
  })
  return refs;
}