/* global JSON_RPC_URL, MASTER_COPY, FACTORY, CLAIM_HOST, API_HOST_RINKEBY, API_HOST_MAINNET, INITIAL_BLOCK_MAINNET, INITIAL_BLOCK_RINKEBY */
let jsonRpcUrl, masterCopy, factory, claimHost, apiHostRinkeby, apiHostMainnet, initialBlockRinkeby, initialBlockMainnet
try {
  const config = require('../../configs/app.config.json')
  jsonRpcUrl = String(config.jsonRpcUrl)
  masterCopy = String(config.masterCopy)
  factory = String(config.factory)
  claimHost = String(config.claimHost)
  apiHostRinkeby = String(config.apiHostRinkeby)
  initialBlockMainnet = config.initialBlockMainnet
  initialBlockRinkeby = config.initialBlockRinkeby
} catch (e) {
  jsonRpcUrl = JSON_RPC_URL
  masterCopy = MASTER_COPY
  factory = FACTORY
  claimHost = CLAIM_HOST
  apiHostRinkeby = API_HOST_RINKEBY
  apiHostMainnet = API_HOST_MAINNET
  initialBlockMainnet = INITIAL_BLOCK_MAINNET
  initialBlockRinkeby = INITIAL_BLOCK_RINKEBY
}

module.exports = {
  jsonRpcUrl,
  claimHost,
  apiHostMainnet,
  apiHostRinkeby,
  masterCopy,
  factory,
  initialBlockMainnet,
  initialBlockRinkeby
}
