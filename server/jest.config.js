module.exports = {
  verbose: true,
  collectCoverage: true,
  collectCoverageFrom: [
    '**/*.js',
    '!**/node_modules/**'
  ],
  coverageDirectory: './coverage',
  transform: {
    '^.+\\.js?$': 'babel-jest'
  },
};
