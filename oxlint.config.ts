import core from "@howells/lint/oxlint/core";

const legacyCompatibilityRules = {
  complexity: "off",
  "func-style": "off",
  "no-empty-function": "off",
  "no-negated-condition": "off",
  "no-nested-ternary": "off",
  "no-plusplus": "off",
  "no-script-url": "off",
  "no-use-before-define": "off",
  "prefer-destructuring": "off",
  "promise/avoid-new": "off",
  "promise/param-names": "off",
  "promise/prefer-await-to-callbacks": "off",
  "promise/prefer-await-to-then": "off",
  "require-await": "off",
  "require-unicode-regexp": "off",
  "sort-keys": "off",
  "typescript/no-dynamic-delete": "off",
  "unicorn/no-array-for-each": "off",
  "unicorn/no-array-sort": "off",
  "unicorn/no-await-expression-member": "off",
  "unicorn/no-negated-condition": "off",
  "unicorn/no-nested-ternary": "off",
  "unicorn/no-useless-fallback-in-spread": "off",
  "unicorn/numeric-separators-style": "off",
  "unicorn/prefer-native-coercion-functions": "off",
  "unicorn/prefer-response-static-json": "off",
};

export default {
  extends: [core],
  ignorePatterns: ["coverage/**", "dist/**", "node_modules/**", ".vercel/**"],
  rules: legacyCompatibilityRules,
};
