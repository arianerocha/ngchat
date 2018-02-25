module.exports = {
  verbose: true,
  collectCoverage: true,
  collectCoverageFrom: [
        '**/*.js',
        '!**/node_modules/**'
    ],
  coverageDirectory: './coverage',
  setupTestFrameworkScriptFile: '<rootDir>/config/jest/setup.js',
  transform: {
    '^.+\\.js?$': 'babel-jest'
  },
  moduleNameMapper: {
    '^.+\\.(css|less|scss|html)$': 'identity-obj-proxy'
  }
};
