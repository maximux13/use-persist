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

### usePersist

```js
const { setValue, getValue } = usePersist(key, config)
```

### API

| argument | type | default
|----------|------|--------|
| key | string | undefined |
| config | object | `{ blacklist: {}, storage: localStorage }` |

`config.blacklist = {}`

```js
const value = { auth: { token: 'abc123', isLoading: false, user: { firstName: 'John', lastName: 'Doe' } } }

// If you want to remove the whole `auth` key in the stored value, use `key: true` syntax
// Result: {}
const blacklist = { auth: true }
// If you want to remove partial keys in the stored value, use an array with the list of keys to remove `key: [string, [...string]]`
// Result: { auth: { token: 'abc123', user: { firstName: 'John', lastName: 'Doe' } } }
const blacklist = { auth: ['isLoading'] }
// If you want to remove nested values in the stored value, use an object syntax
// Result: { auth: { token: 'abc123', user: { firstName: 'John' } } }
const blacklist = { auth: { user: ['lastName'], isLoading: true } }
```

`config.storage = localStorage`

By default we set `localStorage` as a default storage handler, but you could also use `sessionStorage` or make your custom implementation based on [Storage API](https://developer.mozilla.org/en-US/docs/Web/API/Storage) interface.

### Return values:

`setValue: (value: object) => void`

the `setValue` function is used to update the value in your storage

`getValue: () => *`

the `getValue` function is used retrieve the data stored

## Usage:

```js
import usePersist from 'use-persist';

const value = { auth: { token: 'yolo', isLoading: true } };

const { setValue, getValue } = usePersist('key', { blacklist: { auth: ['isLoading'] } });

setValue(value);
```
