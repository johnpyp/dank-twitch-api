module.exports = {
  root: true,
  env: {
    es6: true,
    jest: true,
    node: true,
  },
  globals: {
    Atomics: "readonly",
    SharedArrayBuffer: "readonly",
  },
  extends: [
    "airbnb-base",
    "plugin:@typescript-eslint/recommended",
    "plugin:prettier/recommended",
  ],
  rules: {
    "no-console": 0,
    "import/extensions": 0,
    "import/no-unresolved": 0,
    "no-await-in-loop": 0,
    "@typescript-eslint/camelcase": 0,
  },

  parser: "@typescript-eslint/parser",
};
