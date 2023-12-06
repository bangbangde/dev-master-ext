import { STORAGE_KEY } from "@/modules/consts";
import { getRefs } from "@/utils/refs";

let refs = {};
const storage = chrome.storage.local;

window.addEventListener('load', () => {
  refs = getRefs();

  storage.get().then(res => {
    refs.inputPAT.value = res[STORAGE_KEY.GITHUB_PERSONAL_ACCESS_TOKEN] || '';
    refs.inputSAK.value = res[STORAGE_KEY.CHAT_GPT_SECRET_API_KEY] || '';
    refs.inputToken.value = res[STORAGE_KEY.CHAT_GPT_WEB_TOKEN] || '';
  });

  refs.btnSavePAT.addEventListener('click', () => {
    if (window.confirm('确认更新？')) {
      const value = refs.inputPAT.value;
      storage.set({
        [STORAGE_KEY.GITHUB_PERSONAL_ACCESS_TOKEN]: value
      })
    }
  });
  refs.btnSaveSAK.addEventListener('click', () => {
    if (window.confirm('确认更新？')) {
      const value = refs.inputSAK.value;
      storage.set({
        [STORAGE_KEY.CHAT_GPT_SECRET_API_KEY]: value
      })
    }
  });
  refs.btnSaveToken.addEventListener('click', () => {
    if (window.confirm('确认更新？')) {
      const value = refs.inputToken.value;
      storage.set({
        [STORAGE_KEY.CHAT_GPT_WEB_TOKEN]: value
      })
    }
  })
})