/// <reference types="node" />
/// <reference types="config" />

const {version, description, name} = require('../package.json');
const config = require('config');
const apiConfig = config.get('api');
const serverConfig = config.get('server');

const api = {
  swagger: '2.0',
  info: {
    title: name,
    description,
    version,
  },
  produces: ['text/plain', 'application/json'],
  host: `${serverConfig.host}:${serverConfig.port}`,
  basePath: apiConfig.basePath,
  paths: {
    '/keys': {
      get: {
        'x-swagger-router-controller': 'cache',
        'operationId': 'getKeys',
        'tags': ['cache'],
        'description': 'Get all keys',
        'produces': 'application/json',
        'parameters': [],
        'responses': {
          200: {
            description: 'All cache keys list',
            schema: {
              type: 'array',
              items: {
                type: 'string',
              },
            },
          },
        },
      },
    },
    '/cache': {
      get: {
        'x-swagger-router-controller': 'cache',
        'operationId': 'getAll',
        'tags': ['cache'],
        'description': 'Get all cache entries',
        'produces': 'application/json',
        'parameters': [],
        'responses': {
          200: {
            description: 'All cache entries list',
            schema: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  key: {
                    type: 'string',
                  },
                  value: {
                    type: 'string',
                  },
                  ttl: {
                    type: 'number',
                  },
                },
              },
            },
          },
        },
      },
      delete: {
        'x-swagger-router-controller': 'cache',
        'operationId': 'deleteAll',
        'tags': ['cache'],
        'description': 'Delete all cache entries',
        'parameters': [],
        'responses': {
          204: {
            description: 'Cache cleared',
          },
        },
      },
    },
    '/cache/{key}': {
      get: {
        'x-swagger-router-controller': 'cache',
        'operationId': 'get',
        'tags': ['cache'],
        'description': 'Get cache entry',
        'parameters': [
          {
            name: 'key',
            in: 'path',
            type: 'string',
            required: true,
            description: 'Cache key',
          },
        ],
        'responses': {
          200: {
            description: 'Cache HIT',
            schema: {
              type: 'string',
            },
          },
          201: {
            description: 'Cache MISS. New value created',
            schema: {
              type: 'string',
            },
          },
          400: {
            description: 'Bad request',
            schema: {
              type: 'string',
            },
          },
        },
      },
      put: {
        'x-swagger-router-controller': 'cache',
        'operationId': 'set',
        'tags': ['cache'],
        'description': 'Set cache entry',
        'consumes': ['text/plain'],
        'parameters': [
          {
            name: 'key',
            in: 'path',
            type: 'string',
            required: true,
            description: 'Cache key',
          },
          {
            name: 'ttl',
            in: 'query',
            type: 'number',
            required: false,
            description: 'Cache item ttl',
          },
          {
            name: 'value',
            in: 'body',
            type: 'string',
            consumes: ['text/plain'],
            required: true,
            description: 'Cache value',
          },
        ],
        'responses': {
          201: {
            description: 'Cache item created',
            schema: {
              type: 'string',
            },
          },
          400: {
            description: 'Bad request',
            schema: {
              type: 'string',
            },
          },
        },
      },
      delete: {
        'x-swagger-router-controller': 'cache',
        'operationId': 'delete',
        'tags': ['cache'],
        'description': 'Remove entry from cache',
        'parameters': [
          {
            name: 'key',
            in: 'path',
            type: 'string',
            required: true,
            description: 'Cache key',
          },
        ],
        'responses': {
          204: {
            description: 'Cache item removed',
          },
          400: {
            description: 'Bad request',
            schema: {
              type: 'string',
            },
          },
          404: {
            description: 'Key not found',
            schema: {
              type: 'string',
            },
          },
        },
      },
    },
  },
};

module.exports = api;
