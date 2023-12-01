const action = chrome.action;

action.getUserSettings().then(res => {
  console.log({...res});
})

export default {}
