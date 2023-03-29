/**
 * @type {import('@types/eslint').Linter.BaseConfig}
 */
module.exports = {
  root: true,
  extends: ['custom'],
  parserOptions: {
    project: 'apps/api/tsconfig.json',
  },
}
