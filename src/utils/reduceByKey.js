export default function reduceByKey(obj, keys) {
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
