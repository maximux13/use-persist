import { renderHook, cleanup, act } from 'react-hooks-testing-library';

import fakeStorage from './mockStorage';
import { usePersistState } from '../';

const defaultConfig = {
  key: 'app',
  storage: fakeStorage,
};

describe('usePersist', () => {
  afterEach(cleanup);

  afterEach(() => {
    fakeStorage.clear();
  });

  test('Should initialize with undefined if defaultValue is not defined', () => {
    const config = { ...defaultConfig };

    const { result } = renderHook(() => usePersistState(config));

    let [value, setValue] = result.current;

    expect(value).toEqual(undefined);
    expect(fakeStorage.getItem(config.key)).toEqual(JSON.stringify(undefined));
  });

  test('Should allow non object types: number, array, boolean', () => {
    const config = { ...defaultConfig };

    const { result: numberResult } = renderHook(() =>
      usePersistState(config, 0)
    );

    let [value, setValue] = numberResult.current;

    expect(value).toEqual(0);
    expect(fakeStorage.getItem(config.key)).toEqual(JSON.stringify(0));
  });

  test('Should initialize with stored value if value is not an object', () => {
    const config = { ...defaultConfig };

    fakeStorage.setItem(config.key, '1');

    const { result } = renderHook(() => usePersistState(config, 0));

    let [value, setValue] = result.current;

    expect(value).toEqual(1);
    expect(fakeStorage.getItem(config.key)).toEqual('1');
  });

  test('Should initialize with a merged object between defaultValue and stored value', () => {
    const blacklist = { isLoading: true };
    const config = { ...defaultConfig, blacklist: blacklist };

    fakeStorage.setItem(config.key, '{"token":"abc"}');

    const { result } = renderHook(() =>
      usePersistState(config, {
        token: null,
        isLoading: false,
      })
    );

    let [value, setValue] = result.current;

    expect(value).toEqual({ token: 'abc', isLoading: false });
    expect(fakeStorage.getItem(config.key)).toEqual('{"token":"abc"}');
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

    [value] = result.current;

    expect(value).toEqual({ auth: { token: 'abc', isLoading: false } });
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
