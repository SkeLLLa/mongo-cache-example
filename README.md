# mongo-cache-example

Example express app that implements mongo-backed cache server with plain HTTP API

## Getting started

### Requirements

- `>=node-8.0.0`
- `>=mongodb-3.4.0`

### Install dependencies

```bash
npm i
```

### Update configuration

In order to update configuration (if needed) you may create `local.js` in `config/` directory with needed variables overrides.

Example:

```js
const config = {};
module.exports = config;

config.cache = {
  size: 100,
  ttl: 3 * 60 * 1000,
};

config.db = {
  url: 'mongodb://example.com:27017',
};
```

### Run server

```bash
npm start
```

## Releasing new version

Use `npm version` command to release new version. It will do all necessary checks and will push it to VCS
