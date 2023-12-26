/**
 * Auto-Update Storage Cache
 * @param {object} [options]
 * @param {object} [options.initialData]
 * @param {string} [options.area]
 * @param {function} [options.onInit]
 * @returns 
 */
export const useStorageCache = (options = {}) => {
  const {initialData, area = 'local'} = options;
  const cache = {};

  if (initialData) {
    Object.entries(initialData).forEach(([k, v]) => {
      caches[k] = JSON.parse(JSON.stringify(v));
    });
  }

  chrome.storage[area].onChanged.addListener((changes, _area) => {
    if (area !== _area) return;
    Object.entries(changes).forEach(([k, v]) => {
      cache[k] = v.newValue;
    })
  });

  chrome.storage[area].get().then(items => {
    Object.assign(cache, items);
    options.onInit && options.onInit(cache);
  });

  return cache;
}