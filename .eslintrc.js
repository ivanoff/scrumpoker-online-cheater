module.exports = {
  "plugins": [
    "security"
  ],
  "parser": "babel-eslint",
  "extends": [
    "airbnb-base",
    "plugin:security/recommended",
  ],
  "env": {
    "mocha": true
  },
  "rules": {
    "no-plusplus": "off",
    "no-restricted-syntax": "off",
    "no-continue": "off",
    "no-console": "off",
    "no-throw-literal": "off",
    "consistent-return": "off",
    "no-nested-ternary": "off",
    "camelcase": "off",
    "no-await-in-loop": "off",
    "security/detect-non-literal-fs-filename": "off",
  },
};