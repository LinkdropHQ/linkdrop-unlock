/* global JSON_RPC_URL, MASTER_COPY, INFURA_PK, FACTORY, CLAIM_HOST, API_HOST */
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
const apiHost = API_HOST || String(config.apiHost)
const infuraPk = INFURA_PK || String(config.infuraPk)

module.exports = {
  jsonRpcUrl,
  claimHost,
  apiHost,
  masterCopy,
  factory,
  infuraPk
}
