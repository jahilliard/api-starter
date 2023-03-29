/**
 * @type {import('@types/eslint').Linter.BaseConfig}
 */
module.exports = {
  root: true,
  extends: ['custom'],
  // https://github.com/vercel/turbo/discussions/620
  parserOptions: {
    tsconfigRootDir: __dirname,
    project: './tsconfig.json',
  },
}
