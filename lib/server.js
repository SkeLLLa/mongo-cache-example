/// <reference types="node" />
/// <reference types="mongodb" />
/// <reference types="config" />
/// <reference types="express" />

const express = require('express');
const ui = require('swagger-ui-express');
const apiDoc = require('./api-doc');
const bodyParser = require('body-parser');
const router = require('swagger-express-router');
const api = require('./api');
const config = require('config');
const app = express();
const {connect} = require('./db');

const apiConfig = config.get('api');
const serverConfig = config.get('server');

app.use(
  apiConfig.docsPath,
  ui.serve,
  ui.setup(apiDoc, {
    explorer: true,
  })
);
app.use(bodyParser.text());
router.setUpRoutes(api, app, apiDoc, true);

exports.start = async () => {
  await connect();
  app.listen(serverConfig);
};
