import { getRefs } from "@/modules/getRefs";

window.addEventListener('load', () => {
  window['refs'] = getRefs();

  refs.chatInput.addEventListener('keydown', ev => {
    console.log(ev);
  })
})