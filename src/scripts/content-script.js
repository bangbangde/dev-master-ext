import {addSelectionChangeListener} from "@/utils/selection";
import {KEYS, sendMessage} from "@/modules/message";

addSelectionChangeListener(selection => {
  return sendMessage(KEYS.CONTENT_SCRIPT_SELECTION, selection.toString())
})