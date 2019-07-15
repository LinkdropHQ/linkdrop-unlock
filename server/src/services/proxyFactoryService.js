import LinkdropFactory from '../../../contracts/build/LinkdropFactory'
import LinkdropSDK from '../../../sdk/src/index'
import relayerWalletService from './relayerWalletService'
import configs from '../../../configs'
const config = configs.get('server')
const ethers = require('ethers')
ethers.errors.setLogLevel('error')

class ProxyFactoryService {
  constructor () {
    // initialize proxy factory
    this.contract = new ethers.Contract(
      config.factory,
      LinkdropFactory.abi,
      relayerWalletService.relayerWallet
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
      config.factory,
      masterAddress,
      initcode
    )
  }
}

export default new ProxyFactoryService()
