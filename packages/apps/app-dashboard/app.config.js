/* global JSON_RPC_URL, MASTER_COPY, FACTORY, CLAIM_HOST, API_HOST */
let jsonRpcUrl, masterCopy, factory, claimHost, apiHost
try {
  const config = require('../../../configs/app.config.json')
  jsonRpcUrl = String(config.jsonRpcUrl)
  masterCopy = String(config.masterCopy)
  factory = String(config.factory)
  claimHost = String(config.claimHost)
  apiHost = String(config.apiHost)
} catch (e) {
  jsonRpcUrl = JSON_RPC_URL
  masterCopy = MASTER_COPY
  factory = FACTORY
  claimHost = CLAIM_HOST
  apiHost = API_HOST
}

module.exports = {
  jsonRpcUrl,
  claimHost,
  apiHost,
  masterCopy,
  factory
}
