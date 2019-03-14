const { renderHook, cleanup, act } = require('react-hooks-testing-library');

const fakeStorage = require('./mockStorage');
const { usePersistState } = require('../');

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

const defaultConfig = {
  key: 'app',
  storage: fakeStorage,
};

describe('usePersist', () => {
  afterEach(cleanup);

  afterEach(() => {
    fakeStorage.clear();
  });

  test('Should initialize with an empty object if defaultValue is not defined', () => {
    const blacklist = { auth: true };
    const config = { ...defaultConfig, blacklist: blacklist };

    const { result } = renderHook(() => usePersistState(config));

    let [value, setValue] = result.current;

    expect(value).toEqual({});
    expect(fakeStorage.getItem(config.key)).toEqual('{}');
  });

  test('Should initialize with a merged object between defaultValue and stored value', () => {
    const blacklist = { auth: ['isLoading'] };
    const config = { ...defaultConfig, blacklist: blacklist };

    fakeStorage.setItem(config.key, '{"auth":{"token":"abc"}}');

    const { result } = renderHook(() =>
      usePersistState(config, {
        auth: { token: null, isLoading: false },
      })
    );

    let [value, setValue] = result.current;

    expect(value).toEqual({ auth: { token: 'abc', isLoading: false } });
    expect(fakeStorage.getItem(config.key)).toEqual('{"auth":{"token":"abc"}}');
  });

  test('Should omit whole auth key if blacklist { auth: true }', () => {
    const blacklist = { auth: true };
    const config = { ...defaultConfig, blacklist: blacklist };

    const { result } = renderHook(() =>
      usePersistState(config, {
        auth: { token: null, isLoading: false },
      })
    );

    let [value, setValue] = result.current;

    expect(value).toEqual({ auth: { token: null, isLoading: false } });

    act(() => {
      setValue({ auth: { token: 'abc', isLoading: false } });
    });

    [newValue] = result.current;

    expect(newValue).toEqual({ auth: { token: 'abc', isLoading: false } });
    expect(fakeStorage.getItem(config.key)).toEqual(JSON.stringify({}));
  });

  test('Should omit isLoading key from auth if blacklist { auth: ["isLoading"] }', () => {
    const blacklist = { auth: ['isLoading'] };
    const config = { ...defaultConfig, blacklist: blacklist };

    const { result } = renderHook(() =>
      usePersistState(config, {
        auth: { token: null, isLoading: false },
      })
    );

    let [value, setValue] = result.current;

    expect(value).toEqual({ auth: { token: null, isLoading: false } });

    act(() => {
      setValue({ auth: { token: 'abc', isLoading: false } });
    });

    [value] = result.current;

    expect(value).toEqual({ auth: { token: 'abc', isLoading: false } });

    expect(fakeStorage.getItem(config.key)).toEqual(
      JSON.stringify({ auth: { token: 'abc' } })
    );
  });
});
