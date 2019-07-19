/* global JSON_RPC_URL, MASTER_COPY, FACTORY, CLAIM_HOST, API_HOST, INITIAL_BLOCK_MAINNET, INITIAL_BLOCK_RINKEBY */
let jsonRpcUrl, masterCopy, factory, claimHost, apiHost, initialBlockRinkeby, initialBlockMainnet
try {
  const config = require('../../configs/app.config.json')
  console.log({ config })
  jsonRpcUrl = String(config.jsonRpcUrl)
  masterCopy = String(config.masterCopy)
  factory = String(config.factory)
  claimHost = String(config.claimHost)
  apiHost = String(config.apiHost)
  initialBlockMainnet = config.initialBlockMainnet
  initialBlockRinkeby = config.initialBlockRinkeby
} catch (e) {
  jsonRpcUrl = JSON_RPC_URL
  masterCopy = MASTER_COPY
  factory = FACTORY
  claimHost = CLAIM_HOST
  apiHost = API_HOST
  initialBlockMainnet = INITIAL_BLOCK_MAINNET
  initialBlockRinkeby = INITIAL_BLOCK_RINKEBY
}

module.exports = {
  jsonRpcUrl,
  claimHost,
  apiHost,
  masterCopy,
  factory,
  initialBlockMainnet,
  initialBlockRinkeby
}
