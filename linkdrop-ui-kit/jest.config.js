module.exports = {
  testMatch: [ '<rootDir>/test/components/**/*.js' ],
  'moduleNameMapper': {
    '\\.(module|css|less|scss|sss|styl)$': '<rootDir>/../node_modules/jest-css-modules'
  },
  'setupTestFrameworkScriptFile': '<rootDir>/enzyme.config.js'
}
