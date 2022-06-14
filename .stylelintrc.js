module.exports = {
  plugins: ["stylelint-prettier"],
  rules: {
      "prettier/prettier": true
  },
  extends: [    "stylelint-prettier/recommended", 
  "stylelint-config-standard-scss", 
  "stylelint-config-standard", 
  "stylelint-config-prettier"]
}
