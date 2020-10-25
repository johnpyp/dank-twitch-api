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
    "max-classes-per-file": 0,
    "import/prefer-default-export": 0,
    "@typescript-eslint/interface-name-prefix": 0,
    "lines-between-class-members": 0,
    "@typescript-eslint/no-explicit-any": 0,
    "@typescript-eslint/explicit-member-accessibility": [
      "error",
      {
        accessibility: "explicit",
        overrides: {
          accessors: "explicit",
          constructors: "no-public",
          methods: "explicit",
          properties: "explicit",
          parameterProperties: "explicit",
        },
      },
    ],
  },

  parser: "@typescript-eslint/parser",
};
