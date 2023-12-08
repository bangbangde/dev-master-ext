export function generateUUID() {
  function pad4(str) {
    return str.padStart(4, '0');
  }
  
  let cryptoObj;
  if (typeof window === 'undefined') {
    cryptoObj = globalThis.crypto;
  } else {
    cryptoObj = window.crypto || window['msCrypto']; // for IE 11
  }
  if (cryptoObj) {
    let array = new Uint16Array(8);
    cryptoObj.getRandomValues(array);

    // UUID version 4
    array[3] = (array[3] & 0x0fff) | 0x4000;
    array[4] = (array[4] & 0x3fff) | 0x8000;

    return (
      pad4(array[0].toString(16)) +
      pad4(array[1].toString(16)) +
      '-' +
      pad4(array[2].toString(16)) +
      '-' +
      pad4(array[3].toString(16)) +
      '-' +
      pad4(array[4].toString(16)) +
      '-' +
      pad4(array[5].toString(16)) +
      pad4(array[6].toString(16)) +
      pad4(array[7].toString(16))
    );
  } else {
    // Fallback for browsers that don't support crypto API
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
      let r = (Math.random() * 16) | 0,
        v = c === 'x' ? r : (r & 0x3) | 0x8;
      return v.toString(16);
    });
  }
}