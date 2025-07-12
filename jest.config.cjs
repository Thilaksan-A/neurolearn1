module.exports = {
  transform: {
    // Use babel-jest to transpile ES Modules
    '^.+\\.[tj]s$': 'babel-jest',
  },
  roots: ['<rootDir>/src/app/tests'],
  testMatch: ['**/*.test.js'],
  testEnvironment: 'node',
  moduleFileExtensions: ['js', 'json', 'node'],
};