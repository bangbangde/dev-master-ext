/**
 * @param {string} key 
 * @param {object} options 
 * @returns 
 */
export const useStorage = async (key, options = {}) => {
  const {
    area = 'local',
    initValue,
    forceUpdate = false,
    watch = false
  } = options;

  const storage = chrome.storage[area];
  let value = initValue
  
  if (forceUpdate) {
    await storage.set({[key]: value});
  } else {
    value = (await storage.get(key))[key];
  }

  const handleChange = (ev) => {
    console.log('handleChange', ev);
    if (ev[key]) {
      if (options.onChanged) {
        options.onChanged(ev);
      }
      value = ev[key].newValue;
    }
  }

  (watch || options.onChanged) && chrome.storage.onChanged.addListener(handleChange);

  return {
    get value() {
      return value;
    },

    async get() {
      value = (await storage.get(key))[key];
      return value;
    },

    /**
     * @param {any} val
     */
    async set(val) {
      return await storage.set({[key]: val});
    }
  }
}