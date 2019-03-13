const { renderHook, cleanup, act } = require('react-hooks-testing-library');

const usePersits = require('../');

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
  afterEach(cleanup);

  const defaultValue = {
    auth: {
      token: 'abc123',
      isLoading: false,
      user: { firstName: 'John', lastName: 'Doe' },
    },
  };

  const defaultConfig = {
    key: 'app',
    storage: mockStorage(),
  };

  test('Should omit complete key if backlist key is boolean', () => {
    const blacklist = { auth: true };
    const config = { ...defaultConfig, blacklist: blacklist };
    let expected = {};

    const { result } = renderHook(() => usePersits(config));

    let [value, setValue] = result.current;

    expect(value).toEqual({});
  });

  test('Should omit key from object if backlist key is an array', () => {
    const blacklist = { auth: ['isLoading'] };
    const config = { ...defaultConfig, blacklist: blacklist };

    const { result } = renderHook(() => usePersits(config));

    const [, setValue] = result.current;

    act(() => setValue(defaultValue));

    const [storedValue] = result.current;

    expect(storedValue).toEqual({
      auth: { token: 'abc123', user: { firstName: 'John', lastName: 'Doe' } },
    });
  });

  test('Should omit nested key from object if backlist key is an object', () => {
    const blacklist = { auth: { user: ['lastName'] } };
    const config = { ...defaultConfig, blacklist: blacklist };

    const { result } = renderHook(() => usePersits(config));

    const [, setValue] = result.current;

    act(() => setValue(defaultValue));

    const [storedValue] = result.current;

    expect(storedValue).toEqual({
      auth: { token: 'abc123', isLoading: false, user: { firstName: 'John' } },
    });
  });

  test('Should omit nested key from object if backlist key is an object', () => {
    const blacklist = { auth: { user: ['lastName'], isLoading: true } };
    const config = { ...defaultConfig, blacklist: blacklist };

    const { result } = renderHook(() => usePersits(config));

    const [, setValue] = result.current;

    act(() => setValue(defaultValue));

    const [storedValue] = result.current;

    expect(storedValue).toEqual({
      auth: { token: 'abc123', user: { firstName: 'John' } },
    });
  });
});
