/* global JSON_RPC_URL, MASTER_COPY, FACTORY */
const config = require('../../configs/scripts.config.json')
let jsonRpcUrl, masterCopy, factory
try {
  jsonRpcUrl = config.jsonRpcUrl
  masterCopy = config.masterCopy
  factory = config.factory
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
