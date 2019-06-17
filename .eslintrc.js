module.exports = {
  "parser": "babel-eslint",
  extends:  [
    'plugin:prettier/recommended'
  ],
  plugins: ['babel'],
  "parserOptions": {
    "sourceType": "module",
    "allowImportExportEverywhere": false,
    "codeFrame": true
  }
}