module.exports = {
  extends: ['eslint:recommended', 'google'],
  parserOptions: {
    ecmaVersion: 2018,
  },
  env: {
    es6: true,
    node: true,
    jest: false,
  },
  rules: {
    'indent': ['error', 2, {SwitchCase: 1}],
    'spaced-comment': ['error', 'always', {markers: ['/']}],
    'no-console': 'off',
    'valid-jsdoc': 'off',
    'require-jsdoc': 'off',
  },
};
