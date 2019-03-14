const mockStorage = () => {
  state = {};

  function setItem(key, value) {
    state[key] = value;
  }

  function getItem(key) {
    return state[key];
  }

  function clear() {
    state = {};
  }

  return {
    setItem,
    getItem,
    clear,
  };
};

module.exports = mockStorage();
