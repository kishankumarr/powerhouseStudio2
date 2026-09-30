import { defineConfig, globalIgnores } from 'eslint/config'
import nextVitals from 'eslint-config-next/core-web-vitals'
import nextTs from 'eslint-config-next/typescript'

export default defineConfig([
  ...nextVitals,
  ...nextTs,
  {
    // Content discipline: every user-visible string lives in src/content.
    files: ['src/app/**/*.tsx', 'src/components/**/*.tsx'],
    rules: {
      'react/jsx-no-literals': [
        'error',
        {
          noStrings: true,
          ignoreProps: true,
          allowedStrings: [
            '·',
            '→',
            '←',
            '↗',
            '+',
            '/',
            '|',
            '—',
            '•',
            ':',
            '(',
            ')',
            '&',
            '*',
            '?',
          ],
        },
      ],
    },
  },
  {
    rules: {
      '@typescript-eslint/no-explicit-any': 'error',
      '@typescript-eslint/consistent-type-imports': ['error', { fixStyle: 'inline-type-imports' }],
    },
  },
  globalIgnores([
    '.next/**',
    'out/**',
    'build/**',
    'next-env.d.ts',
    'brand_assets/**',
    'playwright-report/**',
    'test-results/**',
  ]),
])
