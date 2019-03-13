const React = require('react');
const merge = require('deepmerge');

const omit = require('./utils/omit');

module.exports = function usePersistState(
  { key, blacklist = {}, storage = localStorage },
  defaultValue = {}
) {
  const [value, setValue] = React.useState(() => {
    try {
      const value = storage.getItem(key);

      if (value) {
        const storedValue = JSON.parse(value);
        return merge(defaultValue, storedValue);
      } else {
        const filteredValue = omit(defaultValue, blacklist);
        const stringifyValue = JSON.stringify(filteredValue);
        storage.setItem(key, stringifyValue);
        return defaultValue;
      }
    } catch (err) {
      console.error(err);
      return null;
    }
  });

  function storeValue(value) {
    try {
      const filteredValue = omit(value, blacklist);
      const stringifyValue = JSON.stringify(filteredValue);
      storage.setItem(key, stringifyValue);

      setValue(value);
    } catch (err) {
      console.error(err);
    }
  }

  return [value, storeValue];
};
