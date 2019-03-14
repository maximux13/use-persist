const omit = require('./utils/omit');

module.exports = function persist({
  key,
  blacklist = {},
  storage = localStorage,
}) {
  if (typeof key === 'undefined') {
    throw Error('@persist: config.key is not defined');
  }

  function getValue() {
    const value = storage.getItem(key);
    return JSON.parse(value || null);
  }

  function setValue(value) {
    const filteredValue = omit(value, blacklist);
    const stringifyValue = JSON.stringify(filteredValue);
    storage.setItem(key, stringifyValue);
  }

  return {
    setValue,
    getValue,
  };
};
