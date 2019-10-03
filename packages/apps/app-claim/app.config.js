/* global MASTER_COPY_RINKEBY, MASTER_COPY_MAINNET, INFURA_PK, FACTORY_MAINNET, FACTORY_RINKEBY, INITIAL_BLOCK_GOERLI, INITIAL_BLOCK_KOVAN, INITIAL_BLOCK_ROPSTEN, INITIAL_BLOCK_MAINNET, INITIAL_BLOCK_RINKEBY */

let config
try {
  config = require('../../../configs/app.config.json')
} catch (e) {
  config = {}
}
const masterCopyRinkeby = MASTER_COPY_RINKEBY || String(config.masterCopyRinkeby)
const masterCopyMainnet = MASTER_COPY_MAINNET || String(config.masterCopyMainnet)
const factoryMainnet = FACTORY_MAINNET || String(config.factoryMainnet)
const factoryRinkeby = FACTORY_RINKEBY || String(config.factoryRinkeby)
const initialBlockMainnet = INITIAL_BLOCK_MAINNET || config.initialBlockMainnet || 0
const initialBlockRinkeby = INITIAL_BLOCK_RINKEBY || config.initialBlockRinkeby || 0
const initialBlockGoerli = INITIAL_BLOCK_GOERLI || config.initialBlockGoerli || 0
const initialBlockRopsten = INITIAL_BLOCK_ROPSTEN || config.initialBlockRopsten || 0
const initialBlockKovan = INITIAL_BLOCK_KOVAN || config.initialBlockKovan || 0
const infuraPk = INFURA_PK || String(config.infuraPk)

module.exports = {
  masterCopyRinkeby,
  masterCopyMainnet,
  factoryMainnet,
  factoryRinkeby,
  initialBlockMainnet,
  initialBlockRinkeby,
  infuraPk,
  initialBlockGoerli,
  initialBlockRopsten,
  initialBlockKovan
}
