module.exports = {
  parser: '@babel/eslint-parser',
  plugins: ['node', 'jest', 'prettier'],
  extends: [
    'eslint:recommended',
    'plugin:jest/recommended',
    'plugin:jest/style',
    'plugin:node/recommended',
    'plugin:unicorn/recommended',
    'prettier',
  ],
  parserOptions: {
    ecmaVersion: 2018,
    sourceType: 'script',
    requireConfigFile: false,
  },
  env: {
    browser: false,
    node: true,
    es6: true,
  },
  rules: {
    'unicorn/prefer-module': 'off',
  },
  overrides: [
    {
      files: ['tests/**/*.js'],
    },
  ],
};
