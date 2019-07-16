import LinkdropFactory from '../../../contracts/build/LinkdropFactory'
import relayerWalletService from './relayerWalletService'
import configs from '../../../configs'
import logger from '../utils/logger'
const config = configs.get('server')
const ethers = require('ethers')
ethers.errors.setLogLevel('error')

class ProxyFactoryService {
  constructor() {
    // initialize proxy factory
    this.contract = new ethers.Contract(
      config.factory,
      LinkdropFactory.abi,
      relayerWalletService.relayerWallet
    )
  }

  checkClaimParams({
    weiAmount,
    tokenAddress,
    tokenAmount,
    expirationTime,
    linkId,
    linkdropMasterAddress,
    campaignId,
    linkdropSignerSignature,
    receiverAddress,
    receiverSignature,
    proxyAddress
  }) {
    logger.debug('CHECK CLAIM PARAMS')
    logger.json({
      weiAmount,
      tokenAddress,
      tokenAmount,
      expirationTime,
      linkId,
      linkdropMasterAddress,
      campaignId,
      linkdropSignerSignature,
      receiverAddress,
      receiverSignature,
      proxyAddress
    })

    return this.contract.checkClaimParams(
      weiAmount,
      tokenAddress,
      tokenAmount,
      expirationTime,
      linkId,
      linkdropMasterAddress,
      campaignId,
      linkdropSignerSignature,
      receiverAddress,
      receiverSignature,
      proxyAddress
    )
  }

  claim({
    weiAmount,
    tokenAddress,
    tokenAmount,
    expirationTime,
    linkId,
    linkdropMasterAddress,
    campaignId,
    linkdropSignerSignature,
    receiverAddress,
    receiverSignature,
    proxyAddress
  }) {
    logger.debug('CLAIM PARAMS')
    logger.json({
      weiAmount,
      tokenAddress,
      tokenAmount,
      expirationTime,
      linkId,
      linkdropMasterAddress,
      campaignId,
      linkdropSignerSignature,
      receiverAddress,
      receiverSignature,
      proxyAddress
    })
    const gasPrice = ethers.utils.parseUnits('5', 'gwei')
    return this.contract.claim(
      weiAmount,
      tokenAddress,
      tokenAmount,
      expirationTime,
      linkId,
      linkdropMasterAddress,
      campaignId,
      linkdropSignerSignature,
      receiverAddress,
      receiverSignature,
      { gasLimit: 500000, gasPrice }
    )
  }
}

export default new ProxyFactoryService()
