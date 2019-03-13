const React = require('react');

const omit = require('./utils/omit');

module.exports = function usePersist(
  { key, blacklist = {}, storage = localStorage },
  defaultValue = {}
) {
  const [value, setValue] = React.useState(() => {
    try {
      const value = storage.getItem(key);

      if (value) {
        return JSON.parse(value);
      } else {
        const filteredValue = omit(defaultValue, blacklist);
        const stringifyValue = JSON.stringify(filteredValue);
        storage.setItem(key, stringifyValue);

        return filteredValue;
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

      setValue(filteredValue);
    } catch (err) {
      console.error(err);
    }
  }

  return [value, storeValue];
};
