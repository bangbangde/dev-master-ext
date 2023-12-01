const refs = {};
const storage = chrome.storage.local;

function initRefs() {
  const refEls = document.querySelectorAll('.ref');
  refEls.forEach(item => {
    const refName = Array.from(item.classList).find(clazz => clazz.startsWith('ref-'))
    const name = refName ? refName.substring(4) : null;
    if (name) {
      refs[name] = item;
    }
  })
}

window.addEventListener('load', () => {
  initRefs();

  storage.get().then(res => {
    refs.inputPAT.value = res.githubPersonalAccessToken || '';
    refs.inputSAK.value = res.chatGPTSeecretApiKey || '';
  });

  refs.btnSavePAT.addEventListener('click', () => {
    if (window.confirm('确认更新？')) {
      const value = refs.inputPAT.value;
      storage.set({
        githubPersonalAccessToken: value
      })
    }
  });
  refs.btnSaveSAK.addEventListener('click', () => {
    if (window.confirm('确认更新？')) {
      const value = refs.inputSAK.value;
      storage.set({
        chatGPTSeecretApiKey: value
      })
    }
  })
})