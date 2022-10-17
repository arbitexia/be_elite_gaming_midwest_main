module.exports = {
  env: {
    browser: true,
    es2021: true,
    node: true,
    jest: true
  },
  extends: ['prettier', 'airbnb-base', 'eslint:recommended'],
  overrides: [],
  plugins: ['prettier'],
  parserOptions: {
    parser: 'babel-eslint',
    ecmaVersion: 11,
    sourceType: 'module'
  },
  rules: {
    'import/named': 2,
    'comma-dangle': ['error', 'never'],
    'import/namespace': 2,
    'import/default': 2,
    'import/export': 2,
    'import/prefer-default-export': 0,
    'import/no-unresolved': 0,
    'import/no-anonymous-default-export': [
      'error',
      {
        allowArray: false,
        allowArrowFunction: false,
        allowAnonymousClass: false,
        allowAnonymousFunction: false,
        allowCallExpression: true,
        allowLiteral: false,
        allowObject: true
      }
    ],
    'import/extensions': [
      'error',
      {
        ignorePackages: true,
        pattern: {
          js: 'always'
        }
      }
    ]
  }
};
