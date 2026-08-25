import astroEslintParser from "astro-eslint-parser";
import eslintPluginAstro from "eslint-plugin-astro";
import globals from "globals";
import js from "@eslint/js";
import tseslint from "typescript-eslint";
import typescriptParser from "@typescript-eslint/parser";

/**
 * 静态站 ESLint 扁平配置（对齐 LKM-official-website 主应用，裁剪掉 Vue/具体文件规则）。
 */
export default [
  js.configs.recommended,
  ...eslintPluginAstro.configs["flat/recommended"],
  ...tseslint.configs.recommended,
  {
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,
      },
    },
  },
  {
    files: ["**/*.astro"],
    languageOptions: {
      parser: astroEslintParser,
      parserOptions: {
        parser: "@typescript-eslint/parser",
        extraFileExtensions: [".astro"],
      },
    },
    // Astro 组件脚本（`<script is:inline>` 为纯 JS、普通 `<script>`/`<script lang="ts">`
    // 由 Astro 原生处理）强制类型标注会把非法 TS/JS 打进页面（ts(8010)），故此处豁免。
    rules: {
      "@typescript-eslint/explicit-function-return-type": "off",
    },
  },
  {
    files: ["**/*.{js,jsx,astro}"],
    rules: {
      "no-mixed-spaces-and-tabs": ["error", "smart-tabs"],
      "@typescript-eslint/no-unused-vars": [
        "error",
        {
          argsIgnorePattern: "^_",
          varsIgnorePattern: "^_",
          destructuredArrayIgnorePattern: "^_",
        },
      ],
    },
  },
  {
    // `<script>` 标签内的脚本被分配带 `.js` 扩展名的虚拟文件名。
    files: ["**/*.{ts,tsx}", "**/*.astro/*.js"],
    languageOptions: {
      parser: typescriptParser,
    },
    rules: {
      "no-unused-vars": "off",
      "@typescript-eslint/no-unused-vars": [
        "error",
        {
          argsIgnorePattern: "^_",
          varsIgnorePattern: "^_",
          destructuredArrayIgnorePattern: "^_",
        },
      ],
      "@typescript-eslint/no-non-null-assertion": "off",
      "@typescript-eslint/triple-slash-reference": "off",
    },
  },
  {
    // 仅对纯 TypeScript 文件强制返回类型标注；排除 .astro 相关虚拟文件（ts(8010)）。
    files: ["**/*.{ts,tsx}"],
    ignores: ["**/*.astro/**"],
    rules: {
      "@typescript-eslint/explicit-function-return-type": [
        "error",
        { allowExpressions: true },
      ],
    },
  },
  {
    ignores: [
      "dist",
      "node_modules",
      ".github",
      ".astro",
      ".claude",
      ".superpowers",
      "pnpm-lock.yaml",
    ],
  },
];
