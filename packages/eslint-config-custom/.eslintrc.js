/**
 * @type {import('@types/eslint').Linter.BaseConfig}
 */
var x = require('module').builtinModules.join('|')

var y = '^(' + x + ')(/|$)'

module.exports = {
  plugins: ['simple-import-sort', 'unused-imports', 'prettier'],
  extends: ['plugin:prettier/recommended', 'plugin:import/recommended', 'plugin:import/typescript'],
  settings: {
    'import/resolver': {
      typescript: true,
      node: true,
    },
    // Help eslint-plugin-tailwindcss to parse Tailwind classes outside of className
    // tailwindcss: {
    //   callees: ['tw'],
    // },
    jest: {
      version: 27,
    },
  },
  rules: {
    'prettier/prettier': 'warn',
    'no-console': 'warn',
    'arrow-body-style': ['warn', 'as-needed'],
    '@typescript-eslint/no-duplicate-imports': 'error',
    '@typescript-eslint/consistent-type-imports': 'error',
    '@typescript-eslint/no-unused-vars': [
      'warn',
      {
        vars: 'all',
        args: 'all',
        argsIgnorePattern: '^_',
        destructuredArrayIgnorePattern: '^_',
        ignoreRestSiblings: false,
      },
    ],
    'import/first': 'warn',
    'import/newline-after-import': 'warn',
    'import/no-duplicates': 'warn',
    'unused-imports/no-unused-imports': 'warn',
    'unused-imports/no-unused-vars': [
      'warn',
      {
        vars: 'all',
        varsIgnorePattern: '^_',
        args: 'after-used',
        argsIgnorePattern: '^_',
      },
    ],
    'simple-import-sort/exports': 'warn',
    'simple-import-sort/imports': [
      'warn',
      {
        groups: [
          // Side effect imports first
          ['^\\u0000'],
          // Node.js builtins
          [y],
          // React first, then any other packages
          ['^react$', '^@?\\w'],
          // Absolute imports (doesn"t start with .)
          ['^(\\.|@)prisma', '^[^.]', '^src/'],
          // Relative imports
          [
            // ../whatever/
            '^\\.\\./(?=.*/)',
            // ../
            '^\\.\\./',
            // ./whatever/
            '^\\./(?=.*/)',
            // Anything that starts with a dot
            '^\\.',
          ],
          // Asset imports
          ['^.+\\.(html|scss|sass|css|json|gql|graphql|md|jpg|png)$'],
        ],
      },
    ],
  },
  overrides: [
    // Turn on some typescript rules for typescript files
    {
      files: ['**/*.ts?(x)'], // or *.tsx if using TypeScript
      extends: [
        'plugin:@typescript-eslint/recommended',
        // 'plugin:@typescript-eslint/recommended-requiring-type-checking',
      ],
      rules: {
        '@typescript-eslint/explicit-function-return-type': 'off',
        '@typescript-eslint/explicit-module-boundary-types': 'off',
        '@typescript-eslint/no-explicit-any': 'off',
        '@typescript-eslint/no-unused-vars': 'off',
        '@typescript-eslint/no-non-null-assertion': 'off',
        '@typescript-eslint/no-empty-interface': 'off',
        '@typescript-eslint/no-unsafe-assignment': 'off',
        '@typescript-eslint/no-unsafe-call': 'off',
      },
    },
  ],
}
