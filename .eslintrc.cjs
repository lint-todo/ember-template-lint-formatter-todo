module.exports = {
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint', 'node', 'prettier'],
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:node/recommended',
    'plugin:unicorn/recommended',
    'prettier',
  ],
  parserOptions: {
    ecmaVersion: 2018,
    sourceType: 'module',
    requireConfigFile: false,
  },
  env: {
    browser: false,
    node: true,
    es6: true,
  },
  rules: {
    '@typescript-eslint/no-unused-vars': 'error',
    '@typescript-eslint/ban-ts-comment': 'off',
    '@typescript-eslint/no-explicit-any': 'off',
    'unicorn/prefer-node-protocol': 'off',
    'unicorn/import-style': 'off',
    'node/no-missing-import': [
      'error',
      {
        allowedModules: ['@scalvert/bin-tester', './utils/ember-template-lint-project'],
      },
    ],
  },
  overrides: [
    {
      files: ['tests/**/*.ts'],
    },
    {
      files: ['**/*.cjs'],
      parserOptions: {
        sourceType: 'script',
      },
      rules: {
        '@typescript-eslint/no-var-requires': 'off',
      },
    },
  ],
};
