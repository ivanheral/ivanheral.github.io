module.exports = {
  "parser": "babel-eslint",
  extends: [
    "plugin:prettier/recommended"
  ],
  plugins: ["babel"],
  "parserOptions": {
    "sourceType": "module",
    "ecmaVersion": 2018
  },
  "ignorePatterns": ["/server/*.js"],
}