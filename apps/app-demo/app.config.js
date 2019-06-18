/* global JSON_RPC_URL, MASTER_COPY, FACTORY */
let jsonRpcUrl, masterCopy, factory
try {
  const config = require('../../configs/app.config.json')
  jsonRpcUrl = String(config.jsonRpcUrl)
  masterCopy = String(config.masterCopy)
  factory = String(config.factory)
} catch (e) {
  jsonRpcUrl = JSON_RPC_URL
  masterCopy = MASTER_COPY
  factory = FACTORY
}

module.exports = {
  jsonRpcUrl,
  claimHost: 'https://claim.linkdrop.io',
  apiHost: 'https://rinkeby.linkdrop.io',
  masterCopy,
  factory
}
