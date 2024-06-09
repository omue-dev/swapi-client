// eslint.config.js
import js from "@eslint/js";
import react from "eslint-plugin-react";
import reactHooks from "eslint-plugin-react-hooks";
import typescript from "@typescript-eslint/eslint-plugin";
import prettier from "eslint-plugin-prettier";
import parser from "@typescript-eslint/parser";

export default [
  {
    files: ["**/*.{js,jsx,ts,tsx}"],
    ignores: ["node_modules"],
    languageOptions: {
      parser: parser,
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
        ecmaVersion: "latest",
        sourceType: "module",
      },
      globals: {
        window: "readonly",
        document: "readonly",
        navigator: "readonly",
        console: "readonly",
      },
    },
    plugins: {
      react: react,
      "react-hooks": reactHooks,
      "@typescript-eslint": typescript,
      prettier: prettier,
    },
    rules: {
      ...js.configs.recommended.rules,
      ...react.configs.recommended.rules,
      ...typescript.configs.recommended.rules,
      "prettier/prettier": "error",
      "react/react-in-jsx-scope": "off",
      "@typescript-eslint/no-unused-vars": ["error"],
    },
    settings: {
      react: {
        version: "detect",
      },
    },
  },
];
