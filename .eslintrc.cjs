'use strict'

const path = require('node:path')

const tsconfigRootDir = __dirname
const projects = [
  'packages/bot/src/tsconfig.json',
  'packages/bot/tests/tsconfig.json',
  'packages/bot/scripts/tsconfig.json',
  'packages/commitlint-plugin/tsconfig.json',
  'packages/eslint-plugin/tsconfig.json',
  'packages/semantic-release/tsconfig.json',
  'packages/url-shim/tsconfig.json',
  'scripts/tsconfig.json'
]

/** @type {import('eslint').Linter.Config & {parserOptions?: import('@typescript-eslint/parser').ParserOptions}} */
module.exports = {
  root: true,
  extends: [
    '@cherryblossom/eslint-config/node',
    '@cherryblossom/eslint-config/node/16'
  ],
  ignorePatterns: ['.history/', 'dist/'],
  parserOptions: {
    project: projects,
    tsconfigRootDir,
    EXPERIMENTAL_useSourceOfProjectReferenceRedirect: true
  },
  overrides: [
    {
      files: ['**/*.config*.cjs', '**/.eslintrc.cjs'],
      settings: {
        jsdoc: {mode: 'typescript'}
      },
      rules: {
        camelcase: 0,
        'id-length': 0,
        'import/no-extraneous-dependencies': 0,
        'import/no-unused-modules': 0
      }
    },
    {
      files: '**/*.config*.cjs',
      rules: {
        // Allow @typedef {import('ts-jest')} (stops 'Tag @typedef must have a name/namepath in "typescript" mode')
        'jsdoc/valid-types': 0,
        'node/no-unpublished-require': 0
      }
    },
    {
      files: '**/*.ts',
      settings: {
        'import/resolver': {
          typescript: {
            project: projects.map(project =>
              path.join(tsconfigRootDir, project)
            )
          }
        }
      }
    },
    {
      files: ['scripts/**/*.ts', 'packages/*/scripts/**/*.ts'],
      extends: ['@cherryblossom/eslint-config/ts/node/esm'],
      rules: {
        'node/no-extraneous-import': 0,
        'node/no-process-exit': 0,
        'node/no-unpublished-import': 0
      }
    }
  ]
}
