import LinkdropFactory from '../../../contracts/build/LinkdropFactory'
import configs from '../../../configs'
import LinkdropSDK from '../../../sdk/src/index'
const ethers = require('ethers')
ethers.errors.setLogLevel('error')
const config = configs.get('server')
const { jsonRpcUrl, factory, relayerPrivateKey } = config

// #TODO move to special function
if (jsonRpcUrl == null || jsonRpcUrl === '') {
  throw new Error('Please provide json rpc url')
}

if (factory == null || factory === '') {
  throw new Error('Please provide proxy factory address')
}

if (relayerPrivateKey == null || relayerPrivateKey === '') {
  throw new Error('Please provide relayer private key')
}

class ProxyFactoryService {
  constructor () {
    const provider = new ethers.providers.JsonRpcProvider(jsonRpcUrl)
    const relayer = new ethers.Wallet(relayerPrivateKey, provider)
    
    // initialize proxy factory
    this.contract = new ethers.Contract(
      factory,
      LinkdropFactory.abi,
      relayer
    )
  }
  
  // Check claim params
  _checkClaimParams ({
    weiAmount,
    tokenAddress,
    tokenAmount,
    expirationTime,
    linkId,
    linkdropMasterAddress,
    linkdropSignerSignature,
    receiverAddress,
    receiverSignature,
    proxyAddress
  }) {
    return this.contract.checkClaimParams(
      weiAmount,
      tokenAddress,
      tokenAmount,
      expirationTime,
      linkId,
      linkdropMasterAddress,
      linkdropSignerSignature,
      receiverAddress,
      receiverSignature,
      proxyAddress
    )
  }
  
  async _sendClaimTxTopup ({
    weiAmount,
    tokenAddress,
    tokenAmount,
    expirationTime,
    linkId,
    linkdropMasterAddress,
    linkdropSignerSignature,
    receiverAddress,
    receiverSignature,
    proxyAddress
  }) {
    const gasPrice = ethers.utils.parseUnits('0.005', 'gwei')
    return this.contract.claim(
      weiAmount,
      tokenAddress,
      tokenAmount,
      expirationTime,
      linkId,
      linkdropMasterAddress,
      linkdropSignerSignature,
      receiverAddress,
      receiverSignature,
      { gasLimit: 500000, gasPrice }
    )
  }

  _checkClaimParamsApprove ({
    weiAmount,
    tokenAddress,
    tokenAmount,
    expirationTime,
    linkId,
    linkdropMasterAddress,
    linkdropSignerSignature,
    receiverAddress,
    receiverSignature,
    proxyAddress
  }) {
    return this.contract.checkClaimParams(
      weiAmount,
      tokenAddress,
      tokenAmount,
      expirationTime,
      linkId,
      linkdropMasterAddress,
      linkdropSignerSignature,
      receiverAddress,
      receiverSignature,
      proxyAddress
    )
  }
  
  async _sendClaimTxApprove ({
    weiAmount,
    tokenAddress,
    tokenAmount,
    expirationTime,
    linkId,
    linkdropMasterAddress,
    linkdropSignerSignature,
    receiverAddress,
    receiverSignature,
    proxyAddress
  }) {
    const gasPrice = ethers.utils.parseUnits('0.005', 'gwei')
    return this.contract.claim(
      weiAmount,
      tokenAddress,
      tokenAmount,
      expirationTime,
      linkId,
      linkdropMasterAddress,
      linkdropSignerSignature,
      receiverAddress,
      receiverSignature,
      { gasLimit: 500000, gasPrice }
    )
  }
  
  async claim (params) {
    return params.isApprove === 'true'
            ? this._sendClaimTxApprove(params)
            : this._sendClaimTxTopup(params)
  }

  async checkClaimParams (params) {
    return params.isApprove === 'true'
            ? this._checkClaimParamsApprove(params)
            : this._checkClaimParamsTopup(params)
  }

  async computeProxyAddress (masterAddress) {
    const initcode = await this.contract.getInitcode()
    return LinkdropSDK.computeProxyAddress(
      factory,
      masterAddress,
      initcode
    )
  }
}

export default new ProxyFactoryService()
