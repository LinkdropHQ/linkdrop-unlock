/* global JSON_RPC_URL, MASTER_COPY, INFURA_PK, FACTORY, CLAIM_HOST, API_HOST_RINKEBY, API_HOST_MAINNET, INITIAL_BLOCK_MAINNET, INITIAL_BLOCK_RINKEBY */

let config

try {
  config = require('../../../configs/app.config.json')
} catch (e) {
  config = {}
}

const jsonRpcUrl = JSON_RPC_URL || String(config.jsonRpcUrl)
const masterCopy = MASTER_COPY || String(config.masterCopy)
const factory = FACTORY || String(config.factory)
const claimHost = CLAIM_HOST || String(config.claimHost)
const apiHostRinkeby = API_HOST_RINKEBY || String(config.apiHostRinkeby)
const apiHostMainnet = API_HOST_MAINNET || String(config.apiHostRinkeby)
const initialBlockMainnet = INITIAL_BLOCK_MAINNET || config.initialBlockMainnet
const initialBlockRinkeby = INITIAL_BLOCK_RINKEBY || config.initialBlockRinkeby
const infuraPk = INFURA_PK || String(config.infuraPk)

module.exports = {
  jsonRpcUrl,
  claimHost,
  apiHostMainnet,
  apiHostRinkeby,
  masterCopy,
  factory,
  initialBlockMainnet,
  initialBlockRinkeby,
  infuraPk
}
