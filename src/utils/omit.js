const reduceByKey = require('./reduceByKey');

module.exports = function omit(value, blacklist) {
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
};
