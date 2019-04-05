const myWebpackConfig = require('../webpack.config.js')

module.exports = ({ config }) => ({
  ...config,
  resolve: {
    ...config.resolve,
    modules: [
      ...(config.resolve.modules || []),
      ...(myWebpackConfig.resolve.modules || [])
    ]
  },
  module: {
    ...config.module,
    rules: (myWebpackConfig.module || {}).rules || []
  }
})
