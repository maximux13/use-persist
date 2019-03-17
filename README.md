# usePersist

![GitHub package.json version (branch)](https://img.shields.io/github/package-json/v/maximux13/use-persist/master.svg?style=popout)
![GitHub](https://img.shields.io/github/license/maximux13/use-persist.svg?style=popout)
![npm bundle size](https://img.shields.io/bundlephobia/minzip/use-persist.svg?style=popout)

`usePersist` is an utility that allow you store a value in your localStorage and also provides you a way to prevent store some values.

## Install

```bash
yarn add use-persist
# or
npm install --save use-persist
```

### `usePersistState`

```js
import { usePersistState } from 'use-persist';

const [state, setState] = usePersist(config, initialState);
```

### `usePersistReducer`

```js
import { usePersistReducer } from 'use-persist';

const [state, dispatch] = usePersist(config, reducer, initialState, init);
```

### Config

| argument  | type     | required | default        |
| --------- | -------- | -------- | -------------- |
| key       | `string` | `true`   |                |
| blacklist | `object` | `false`  | `{}`           |
| storage   | `object` | `false`  | `localStorage` |

`config.key: string`

Use `key` to set a indentifier to the value you want to store.

`config.blacklist: object = {}`

Use `blacklist` object to describe the keys you want to omit in the stored value.

```js
const value = {
  auth: {
    token: 'abc123',
    isLoading: false,
    user: { firstName: 'John', lastName: 'Doe' },
  },
};

// If you want to remove the whole `auth` key in the stored value, use `key: true` syntax
// Result: {}
const blacklist = { auth: true };

// If you want to remove partial keys in the stored value, use an array with the list of keys to remove `key: [string, [...string]]`
// Result: { auth: { token: 'abc123', user: { firstName: 'John', lastName: 'Doe' } } }
const blacklist = { auth: ['isLoading'] };

// If you want to remove nested values in the stored value, use an object syntax
// Result: { auth: { token: 'abc123', user: { firstName: 'John' } } }
const blacklist = { auth: { user: ['lastName'], isLoading: true } };
```

`config.storage = localStorage`

By default we set `localStorage` as a default storage handler, but you could also use `sessionStorage` or make your custom implementation based on [Storage API](https://developer.mozilla.org/en-US/docs/Web/API/Storage) interface.
