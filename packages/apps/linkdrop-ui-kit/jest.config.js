module.exports = {
  testMatch: [ '<rootDir>/test/components/**/*.js' ],
  'moduleNameMapper': {
    '\\.(module|less|sss|styl)$': '<rootDir>/../../node_modules/jest-css-modules',
    '\\.(css|sass)$': '<rootDir>/__mocks__/style-mock.js',
    'variables(.*)$': '<rootDir>/__mocks__/style-mock.js'
  },
  'setupTestFrameworkScriptFile': '<rootDir>/enzyme.config.js'
}
