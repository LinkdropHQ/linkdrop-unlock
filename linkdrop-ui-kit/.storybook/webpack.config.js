const myWebpackConfig = require('../webpack.config.js')

module.exports = ({ config }) => ({
  ...config,
  resolve: {
    ...config.resolve,
    extensions: ['.js', '.jsx', '.json', '.scss', '.css', '*'],
    modules: [
      ...(config.resolve.modules || []),
      ...(myWebpackConfig.resolve.modules || [])
    ]
  },
  module: {
    rules: [
      ...((myWebpackConfig.module || {}).rules || [])
    ]
  }
})
