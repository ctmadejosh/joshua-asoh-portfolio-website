import js from "@eslint/js";
import globals from "globals";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import tseslint from "typescript-eslint";

export default tseslint.config(
  { ignores: ["dist"] },
  {
    extends: [js.configs.recommended, ...tseslint.configs.recommended],
    files: ["**/*.{ts,tsx}"],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
    },
    plugins: {
      "react-hooks": reactHooks,
      "react-refresh": reactRefresh,
    },
    rules: {
      ...reactHooks.configs.recommended.rules,
      // React-Compiler-era rules (eslint-plugin-react-hooks 7). Kept on, as
      // warnings: this site pre-renders every page, so values only the browser
      // knows (URL hash, screen size, reduced-motion) must be read in an
      // effect after hydration, or the server HTML and first render disagree.
      // Data loads that start on mount use the same pattern.
      "react-hooks/set-state-in-effect": "warn",
      // Only flags an unused shadcn template (ui/sidebar.tsx).
      "react-hooks/purity": "warn",
      "react-refresh/only-export-components": [
        "warn",
        { allowConstantExport: true },
      ],
      "@typescript-eslint/no-unused-vars": "off",
    },
  }
);
