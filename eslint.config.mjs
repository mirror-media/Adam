import js from '@eslint/js'
import nextPlugin from '@next/eslint-plugin-next'
import jsxA11yPlugin from 'eslint-plugin-jsx-a11y'
import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended'
import reactPlugin from 'eslint-plugin-react'
import reactHooksPlugin from 'eslint-plugin-react-hooks'
import globals from 'globals'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const nextRecommendedRules = nextPlugin.configs.recommended.rules
const nextCoreWebVitalsRules = nextPlugin.configs['core-web-vitals'].rules
const reactRecommendedRules = reactPlugin.configs.flat.recommended.rules
const reactJsxRuntimeRules = reactPlugin.configs.flat['jsx-runtime'].rules
const jsxA11yRecommendedRules = jsxA11yPlugin.flatConfigs.recommended.rules
const __dirname = path.dirname(fileURLToPath(import.meta.url))
const mirrorMediaNextRoot = path.join(__dirname, 'packages/mirror-media-next')

export default [
  {
    ignores: [
      '.git/**',
      '**/node_modules/**',
      '**/.yalc/**',
      '**/.next/**',
      '**/dist/**',
      '**/public/sw.js',
      '**/public/workbox-*.js',
      '**/public/worker-*.js',
    ],
  },
  {
    files: ['**/*.{js,jsx,mjs}'],
    languageOptions: {
      ecmaVersion: 2021,
      sourceType: 'module',
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
      },
      globals: {
        ...globals.browser,
        ...globals.node,
        ...globals.es2021,
      },
    },
    plugins: {
      '@next/next': nextPlugin,
      'jsx-a11y': jsxA11yPlugin,
      react: reactPlugin,
      'react-hooks': reactHooksPlugin,
    },
    settings: {
      next: {
        rootDir: [mirrorMediaNextRoot],
      },
      react: {
        version: '18.2.0',
      },
    },
    rules: {
      ...js.configs.recommended.rules,
      ...nextRecommendedRules,
      ...nextCoreWebVitalsRules,
      ...reactRecommendedRules,
      ...reactJsxRuntimeRules,
      ...jsxA11yRecommendedRules,
      'react/prop-types': 'off',
      'react/display-name': 'off',
      'react/jsx-uses-react': 'error',
      'react/jsx-uses-vars': 'error',
      'react/no-unknown-property': 'error',
      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'warn',
      'no-unused-vars': ['error', { caughtErrors: 'none' }],
    },
  },
  {
    files: ['packages/mirror-media-next/next.config.mjs'],
    languageOptions: {
      ecmaVersion: 2022,
    },
  },
  {
    files: ['packages/mirror-media-next/service-worker/**/*.js'],
    languageOptions: {
      globals: {
        ...globals.serviceworker,
        firebase: 'readonly',
      },
    },
  },
  eslintPluginPrettierRecommended,
]
