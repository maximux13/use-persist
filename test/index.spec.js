const usePersits = require('../src');

const mockStorage = () => {
  state = {};

  function setItem(key, value) {
    state[key] = value;
  }

  function getItem(key) {
    return state[key];
  }

  return {
    setItem,
    getItem,
  };
};

describe('usePersist', () => {
  const value = {
    auth: {
      token: 'abc123',
      isLoading: false,
      user: { firstName: 'John', lastName: 'Doe' },
    },
  };

  test('Should omit complete key if backlist key is boolean', () => {
    const blacklist = { auth: true };
    const config = { blacklist: blacklist, storage: mockStorage() };
    const expected = {};

    const { setValue, getValue } = usePersits('key', config);

    setValue(value);

    expect(getValue()).toEqual(expected);
  });

  test('Should omit key from object if backlist key is an array', () => {
    const blacklist = { auth: ['isLoading'] };
    const config = { blacklist: blacklist, storage: mockStorage() };
    const expected = {
      auth: { token: 'abc123', user: { firstName: 'John', lastName: 'Doe' } },
    };

    const { setValue, getValue } = usePersits('key', config);

    setValue(value);

    expect(getValue()).toEqual(expected);
  });

  test('Should omit nested key from object if backlist key is an object', () => {
    const blacklist = { auth: { user: ['lastName'] } }
    const config = { blacklist: blacklist, storage: mockStorage() };
    const expected = {
      auth: { token: 'abc123', isLoading: false, user: { firstName: 'John' } },
    };

    const { setValue, getValue } = usePersits('key', config);

    setValue(value);

    expect(getValue()).toEqual(expected);
  });

  test('Should omit nested key from object if backlist key is an object', () => {
    const blacklist = { auth: { user: ['lastName'], isLoading: true } }
    const config = { blacklist: blacklist, storage: mockStorage() };
    const expected = {
      auth: { token: 'abc123', user: { firstName: 'John' } },
    };

    const { setValue, getValue } = usePersits('key', config);

    setValue(value);

    expect(getValue()).toEqual(expected);
  });
});
