'use strict'

/** @type {import('eslint').Linter.Config & {parserOptions?: import('@typescript-eslint/parser').ParserOptions}} */
const config = {
  parserOptions: {
    project: 'tsconfig.json',
    tsconfigRootDir: __dirname
  },
  rules: {
    // Too noisy and keeps triggering on catch handlers
    'promise/prefer-await-to-callbacks': 0
  },
  overrides: [
    {
      files: [
        'commands/{message,slash,user}/*.ts',
        'triggers/*.ts',
        'events/*.ts'
      ],
      rules: {
        'import/no-unused-modules': 0
      }
    }
  ]
}
module.exports = config