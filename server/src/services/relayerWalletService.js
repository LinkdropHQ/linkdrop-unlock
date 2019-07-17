import configs from '../../../configs'
const config = configs.get('server')
const { jsonRpcUrl, relayerPrivateKey } = config
const ethers = require('ethers')
ethers.errors.setLogLevel('error')

// #TODO move to special function
if (jsonRpcUrl == null || jsonRpcUrl === '') {
  throw new Error('Please provide json rpc url')
}

if (relayerPrivateKey == null || relayerPrivateKey === '') {
  throw new Error('Please provide relayer private key')
}

class RelayerWalletService {
  constructor () {
    this.provider = new ethers.providers.JsonRpcProvider(jsonRpcUrl)
    this.relayerWallet = new ethers.Wallet(relayerPrivateKey, this.provider)
  }
}

export default new RelayerWalletService()
