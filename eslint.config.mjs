import { defineConfig, globalIgnores } from 'eslint/config';
import nextVitals from 'eslint-config-next/core-web-vitals';
import nextTs from 'eslint-config-next/typescript';
import jsxA11y from 'eslint-plugin-jsx-a11y';

/**
 * ESLint flat config (Next 16).
 *
 * Order matters:
 *   1. Next vitals — performance / RSC / React rules.
 *   2. Next TypeScript — strict TS rules.
 *   3. jsx-a11y recommended **rules only** — the plugin itself is already
 *      registered by eslint-config-next (at warn level). We layer the full
 *      recommended ruleset on top so a11y violations fail CI instead of
 *      surfacing as warnings. Re-registering the plugin would trigger a
 *      flat-config "Cannot redefine plugin" error.
 *
 * Accessibility is a non-negotiable Lighthouse 100, so we error early.
 */
const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  {
    name: 'portfolio/jsx-a11y-recommended',
    rules: jsxA11y.flatConfigs.recommended.rules,
  },
  {
    name: 'portfolio/conventions',
    rules: {
      /**
       * Allow a leading underscore to mark a binding as deliberately unused.
       * The load-bearing case is omit-by-destructuring — pulling a key out of
       * a props object so the remainder can be spread onto a DOM element:
       *
       *   const { href: _href, ...buttonProps } = props;
       *
       * Without this, that pattern has to be replaced by something less clear.
       */
      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
          caughtErrorsIgnorePattern: '^_',
          ignoreRestSiblings: true,
        },
      ],
    },
  },
  globalIgnores(['.next/**', 'out/**', 'build/**', 'next-env.d.ts']),
]);

export default eslintConfig;
