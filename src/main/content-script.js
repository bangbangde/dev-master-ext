import { addSelectionChangeListener } from "@/utils/selectHandler";
addSelectionChangeListener(selection => {
  console.log(selection.toString());
})