const config = {};
module.exports = config;

config.api = {
  basePath: '/api',
  docsPath: '/api-docs',
};

config.cache = {
  size: 10,
  ttl: 60 * 1000,
};

config.server = {
  host: 'localhost',
  port: 3000,
};

config.db = {
  url: 'mongodb://localhost:27017',
  db: 'cache',
  collection: 'items',
};
