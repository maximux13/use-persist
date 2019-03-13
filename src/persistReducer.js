const React = require('react');
const merge = require('deepmerge');

const omit = require('./utils/omit');

module.exports = function usePersistReducer(
  { key, blacklist = {}, storage = localStorage },
  reducer,
  initialState,
  init = (state) => state
) {
  const [state, dispatch] = React.useReducer(reducer, initialState, () => {
    try {
      const state = storage.getItem(key);

      if (value) {
        const storedState = JSON.parse(value);

        return merge(storedState, initialState);
      } else {
        const filteredValue = omit(initialState, blacklist);
        const stringifyValue = JSON.stringify(filteredValue);
        storage.setItem(key, stringifyValue);

        return init(initialState);
      }
    } catch (err) {
      console.error(err);
      return null;
    }
  });

  React.useEffect(() => {
    try {
      const filteredValue = omit(state, blacklist);
      const stringifyValue = JSON.stringify(filteredValue);
      storage.setItem(key, stringifyValue);

      setValue(state);
    } catch (err) {
      console.error(err);
    }
  }, [state]);


  return [state, dispatch];
};
