const config = require('../../configs/scripts.config.json')
module.exports = {
  jsonRpcUrl: config.jsonRpcUrl,
  claimHost: 'https://claim.linkdrop.io',
  apiHost: 'https://rinkeby.linkdrop.io',
  masterCopy: config.masterCopy,
  factory: config.factory
}
