import { MESSAGE_TYPE } from "@/modules/consts";
import { addSelectionChangeListener } from "@/utils/selectHandler";

addSelectionChangeListener(selection => {
  console.log(chrome?.app?.isInstalled);
  // chrome.runtime
  //       .sendMessage({type: MESSAGE_TYPE.POST_SELECTION_TEXT, data: selection.toString()})
  //       .catch(err => {});
})