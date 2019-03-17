import React from 'react';
import merge from 'deepmerge';

import isPlainObject from './utils/isPlainObject';
import persist from './persist';

export default function usePersistState(config, defaultValue) {
  const persistInstance = React.useMemo(() => persist(config), [config]);

  const [value, setValue] = React.useState(() => {
    const storedValue = persistInstance.getValue();

    if (storedValue) {
      if (isPlainObject(defaultValue)) {
        return merge(defaultValue, storedValue);
      }
      return storedValue;
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
}
