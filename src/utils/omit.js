const isPlainObject = require('./isPlainObject');
const reduceByKey = require('./reduceByKey');

module.exports = function omit(value, blacklist) {
  if (!isPlainObject(value)) return value;

  return Object.keys(blacklist).reduce((obj, key) => {
    const current = blacklist[key];

    if (current === true) {
      return reduceByKey(obj, [key]);
    }
    if (Array.isArray(current)) {
      if (current.every(filter => typeof filter === 'string')) {
        if (isPlainObject(obj[key])) {
          return {
            ...obj,
            [key]: reduceByKey(obj[key], current),
          };
        }
      } else {
        throw Error(
          `@persist: Your blacklist config "${key}" has an invalid key, please check all values are strings`
        );
      }
    } else if (typeof current === 'object') {
      if (isPlainObject(obj[key])) {
        return {
          ...obj,
          [key]: omit(obj[key], current),
        };
      }
      // prettier-ignore
      throw Error(`@persist: Your blacklist config "${key}" is an object but in you value it seems that you are not using an object`);
    }

    return {
      ...obj,
      [key]: obj[key],
    };
  }, value);
};
