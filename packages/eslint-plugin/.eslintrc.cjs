'use strict'

/** @type {import('eslint').Linter.Config & {parserOptions?: import('@typescript-eslint/parser').ParserOptions}} */
module.exports = {
  extends: ['plugin:eslint-plugin/recommended'],
  plugins: ['eslint-plugin'],
  parserOptions: {
    project: './tsconfig.json',
    tsconfigRootDir: __dirname
  },

  rules: {
    'eslint-plugin/no-deprecated-context-methods': 2,
    'eslint-plugin/prefer-object-rule': 2,
    'eslint-plugin/prefer-output-null': 2,
    'eslint-plugin/prefer-placeholders': 2,
    'eslint-plugin/prefer-replace-text': 2,
    'eslint-plugin/test-case-property-ordering': 1,
    'eslint-plugin/test-case-shorthand-strings': 1,

    // Just fot types
    'node/no-extraneous-import': [2, {allowModules: ['eslint']}]
  },

  overrides: [
    {
      files: ['src/index.ts', 'src/rules/*.ts'],
      rules: {
        // Main file, imported by main file
        'import/no-unused-modules': 0
      }
    },
    {
      files: ['src/rules/*.ts', 'src/create-*-rule.ts'],
      rules: {
        // Listeners
        '@typescript-eslint/naming-convention': [
          1,
          {
            selector: 'default',
            format: ['camelCase'],
            leadingUnderscore: 'allow',
            trailingUnderscore: 'allow'
          },
          {
            selector: 'variable',
            format: ['camelCase', 'UPPER_CASE'],
            leadingUnderscore: 'allow',
            trailingUnderscore: 'allow'
          },
          {
            selector: 'property',
            format: ['camelCase', 'UPPER_CASE'],
            leadingUnderscore: 'allow',
            trailingUnderscore: 'allow'
          },
          {
            selector: 'method',
            format: ['camelCase', 'PascalCase'],
            leadingUnderscore: 'allow',
            trailingUnderscore: 'allow'
          },
          {
            selector: 'typeLike',
            format: ['PascalCase'],
            leadingUnderscore: 'allow',
            trailingUnderscore: 'allow'
          },
          {
            selector: 'enumMember',
            format: ['UPPER_CASE', 'PascalCase'],
            leadingUnderscore: 'allow',
            trailingUnderscore: 'allow'
          }
        ]
      }
    }
  ]
}