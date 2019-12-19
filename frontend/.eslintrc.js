module.exports = {
  extends: [
    "eslint:recommended",
    "plugin:react/recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:@typescript-eslint/eslint-recommended",
    "react-hooks",
    "plugin:prettier/recommended",
    "prettier/@typescript-eslint"
  ],
  plugins: ["@typescript-eslint", "react-hooks"],
  overrides: [
    {
        files: ["**/*.tsx"],
        rules: {
            "react/prop-types": "off"
        }
    }
  ],
  parser: "@typescript-eslint/parser",
  env: { browser: true, node: true, es6: true },
  parserOptions: {
    sourceType: "module"
  },
  rules: {
    "@typescript-eslint/explicit-function-return-type": 0,
    "@typescript-eslint/no-explicit-any": 0,
    "react-hooks/rules-of-hooks": "error",
    "react-hooks/exhaustive-deps": "warn",
    "react/display-name": 0,
  }
};
