/**
 * @type {import('ts-jest').JestConfigWithTsJest}
 **/
module.exports = {
  testEnvironment: 'node',
  moduleDirectories: ['node_modules', '<rootDir>'],
  displayName: { name: 'API', color: 'magenta' },
  testPathIgnorePatterns: ['/node_modules/'],
  testRegex: ['[\\/]*\\.(test|spec)\\.(j|t)sx?$'],
  transform: {
    '^.+\\.(t|j)sx?$': '@swc/jest',
  },
}
