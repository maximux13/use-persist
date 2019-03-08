(function(name, definition) {
  if (typeof define === 'function') {
    // AMD
    define(definition);
  } else if (typeof module !== 'undefined' && module.exports) {
    // Node.js
    module.exports = definition();
  } else {
    // Browser
    var theModule = definition(),
      global = this,
      old = global[name];
    theModule.noConflict = function() {
      global[name] = old;
      return theModule;
    };
    global[name] = theModule;
  }
})('usePersist', function() {
  function reduceByKey(obj, keys) {
    return Object.keys(obj).reduce((updateObj, key) => {
      if (!keys.includes(key)) {
        return {
          ...updateObj,
          [key]: obj[key],
        };
      }
      return updateObj;
    }, {});
  }

  function omit(value, blacklist) {
    return Object.keys(blacklist).reduce((obj, key) => {
      const current = blacklist[key];

      if (current === true) {
        return reduceByKey(obj, [key]);
      }
      if (Array.isArray(current)) {
        if (current.every(filter => typeof filter === 'string')) {
          if (typeof obj[key] === 'object' && !Array.isArray(obj[key])) {
            return {
              ...obj,
              [key]: reduceByKey(obj[key], current),
            };
          }
        } else {
          throw Error(`Your config key: "${key}" has an invalid key`);
        }
      } else if (typeof current === 'object') {
        if (typeof obj[key] === 'object' && !Array.isArray(obj[key])) {
          return {
            ...obj,
            [key]: omit(obj[key], current),
          };
        }
        // prettier-ignore
        throw Error(`Your config key: "${key}" is an object but in you value it seems that you are not using an object`);
      }

      return {
        ...obj,
        [key]: obj[key],
      };
    }, value);
  }

  return function usePersist(key, { blacklist = {}, storage = localStorage }) {
    function getValue() {
      try {
        const value = storage.getItem(key);
        return JSON.parse(value);
      } catch (err) {
        console.error(err);
        return null;
      }
    }

    function setValue(value) {
      try {
        const filteredValue = omit(value, blacklist);
        const stringifyValue = JSON.stringify(filteredValue);
        storage.setItem(key, stringifyValue);
        return true;
      } catch (err) {
        console.error(err);
        return false;
      }
    }

    return {
      getValue,
      setValue,
    };
  };
});
