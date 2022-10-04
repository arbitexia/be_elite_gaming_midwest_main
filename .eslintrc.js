module.exports = {
  env: {
    browser: true,
    es2021: true
  },
  extends: ['prettier', 'airbnb-base', 'eslint:recommended'],
  overrides: [],
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module'
  },
  rules: {
    'import/no-unresolved': 'off'
  }
};
