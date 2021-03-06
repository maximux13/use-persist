import React from 'react';
import merge from 'deepmerge';

import persist from './persist';
import isPlainObject from './utils/isPlainObject';

export default function usePersistReducer(
  config,
  reducer,
  initialState,
  init = state => state
) {
  const persistInstance = React.useMemo(() => persist(config), [config]);

  const [state, dispatch] = React.useReducer(reducer, initialState, () => {
    const storedValue = persistInstance.getValue();

    if (storedValue) {
      if (isPlainObject(initialState)) {
        return init(merge(initialState, storedValue));
      }
      return storedValue;
    } else {
      persistInstance.setValue(initialState);
      return init(initialState);
    }
  });

  React.useEffect(() => {
    persistInstance.setValue(state);
  }, [state]);

  return [state, dispatch];
}
