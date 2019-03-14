const React = require('react');
const merge = require('deepmerge');

const persist = require('./persist');

module.exports = function usePersistState(config, defaultValue = {}) {
  const persistInstance = React.useMemo(() => persist(config), [config]);

  const [value, setValue] = React.useState(() => {
    const storedValue = persistInstance.getValue();

    if (storedValue) {
      return merge(defaultValue, storedValue);
    } else {
      persistInstance.setValue(defaultValue);
      return defaultValue;
    }
  });

  function storeValue(value) {
    persistInstance.setValue(value);
    setValue(value);
  }

  return [value, storeValue];
};
