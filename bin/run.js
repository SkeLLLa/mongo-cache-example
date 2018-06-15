#!/usr/bin/env node

const server = require('../lib/server');

(async () => {
  try {
    server.start();
  } catch (ex) {
    console.error(ex);
    console.error('Failed to start server');
    process.exit(1);
  }
})();
