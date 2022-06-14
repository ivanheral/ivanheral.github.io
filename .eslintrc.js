module.exports = {
  root: true,
  parser: "@typescript-eslint/parser",
  extends: [
    "plugin:@typescript-eslint/eslint-recommended",
    "plugin:@typescript-eslint/recommended", "plugin:prettier/recommended"
  ],
  plugins: ["@typescript-eslint"],
  rules: {},
  ignorePatterns: ["config/*", "*.js", "global.d.ts"],
  parserOptions: {
    project: "./tsconfig.json"
  }
}