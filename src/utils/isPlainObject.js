export default function isPlainObject(obj) {
  return Object.prototype.toString.call(obj) === '[object Object]';
}
