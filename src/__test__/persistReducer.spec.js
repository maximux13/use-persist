import { renderHook, cleanup, act } from 'react-hooks-testing-library';

import fakeStorage from './mockStorage';
import { usePersistReducer } from '../';

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

    const { result } = renderHook(() =>
      usePersistReducer(config, state => state)
    );

    let [state, dispatch] = result.current;

    expect(state).toEqual(undefined);
    expect(fakeStorage.getItem(config.key)).toEqual(JSON.stringify(undefined));
  });

  test('Should initialize with a merged object between defaultValue and stored value', () => {
    const blacklist = { auth: ['isLoading'] };
    const config = { ...defaultConfig, blacklist: blacklist };

    fakeStorage.setItem(config.key, '{"auth":{"token":"abc"}}');

    const { result } = renderHook(() =>
      usePersistReducer(config, state => state, {
        auth: { token: null, isLoading: false },
      })
    );

    let [state] = result.current;

    expect(state).toEqual({ auth: { token: 'abc', isLoading: false } });
    expect(fakeStorage.getItem(config.key)).toEqual('{"auth":{"token":"abc"}}');
  });

  test('Should update stored value after dispatch an action', () => {
    const blacklist = { isLoading: true };
    const config = { ...defaultConfig, blacklist: blacklist };

    const reducer = (state, action) => {
      switch (action.type) {
        case 'SET_LOADING': {
          return { ...state, isLoading: true };
        }
        case 'SET_TOKEN': {
          return { isLoading: false, token: 'abc' };
        }
        default: {
          return state;
        }
      }
    };

    const { result } = renderHook(() =>
      usePersistReducer(config, reducer, {
        token: null,
        isLoading: false,
      })
    );

    let [state, dispatch] = result.current;

    expect(state).toEqual({ token: null, isLoading: false });
    expect(fakeStorage.getItem(config.key)).toEqual('{"token":null}');

    act(() => dispatch({ type: 'SET_LOADING' }));

    [state] = result.current;

    expect(state).toEqual({ token: null, isLoading: true });
    expect(fakeStorage.getItem(config.key)).toEqual('{"token":null}');

    act(() => dispatch({ type: 'SET_TOKEN' }));

    [state] = result.current;

    expect(state).toEqual({ token: 'abc', isLoading: false });
    expect(fakeStorage.getItem(config.key)).toEqual('{"token":"abc"}');
  });
});
