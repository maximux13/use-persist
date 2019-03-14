const React = require('react');
const merge = require('deepmerge');

const persist = require('./persist');

module.exports = function usePersistReducer(
  config,
  reducer,
  initialState = {},
  init = state => state
) {
  const persistInstance = React.useMemo(() => persist(config), [config]);

  const [state, dispatch] = React.useReducer(reducer, initialState, () => {
    const storedValue = persistInstance.getValue();

    if (storedValue) {
      return init(merge(initialState, storedValue));
    } else {
      persistInstance.setValue(initialState);
      return init(initialState);
    }
  });

  React.useEffect(() => {
    persistInstance.setValue(state);
  }, [state]);

  return [state, dispatch];
};
