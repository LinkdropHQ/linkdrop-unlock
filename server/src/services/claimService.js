import { BadRequestError } from '../utils/errors'
import logger from '../utils/logger'
import proxyFactoryService from './proxyFactoryService'
import operationService from './operationService'
import linkdropService from './linkdropService'

class ClaimService {
  _computeId ({ linkId, linkdropMasterAddress }) {
    return `claim-${linkdropMasterAddress.toLowerCase()}-${linkId.toLowerCase()}`
  }

  // Check whether a claim tx exists in database
  findClaimInDB ({ linkId, linkdropMasterAddress }) {
    const id = this._computeId({ linkId, linkdropMasterAddress })
    return operationService.findById(id)
  }

  findClaimById (id) {
    return operationService.findById(id)
  }

  _checkClaimParams (params) {
    if (!params.weiAmount) {
      throw new BadRequestError('Please provide weiAmount argument')
    }
    if (!params.tokenAddress) {
      throw new BadRequestError('Please provide tokenAddress argument')
    }
    if (!params.tokenAmount) {
      throw new BadRequestError('Please provide tokenAddress argument')
    }
    if (!params.expirationTime) {
      throw new BadRequestError('Please provide expirationTime argument')
    }
    if (!params.version) {
      throw new BadRequestError('Please provide version argument')
    }
    if (!params.chainId) {
      throw new BadRequestError('Please provide chainId argument')
    }
    if (!params.linkId) {
      throw new BadRequestError('Please provide linkId argument')
    }
    if (!params.linkdropMasterAddress) {
      throw new BadRequestError('Please provide linkdropMasterAddress argument')
    }
    if (!params.linkdropSignerSignature) {
      throw new BadRequestError(
        'Please provide linkdropSignerSignature argument'
      )
    }
    if (!params.receiverAddress) {
      throw new BadRequestError('Please provide receiverAddress argument')
    }
    if (!params.receiverSignature) {
      throw new BadRequestError('Please provide receiverSignature argument')
    }

    if (!params.campaignId) {
      throw new BadRequestError('Please provide campaignId argument')
    }

    logger.debug('Valid claim params: ' + JSON.stringify(params))
  }

  async claim (params) {
    // Make sure all arguments are passed
    this._checkClaimParams(params)

    // Check whether a claim tx exists in database
    const claim = await this.findClaimInDB(params)
    if (claim) {
      logger.info(`Existing claim transaction found: ${claim.id}`)
      throw new Error('Claim link was already submitted')
    }
    logger.debug("Claim doesn't exist in database yet. Creating new claim...")

    // compute proxyAddress from master address
    const proxyAddress = await linkdropService.getProxyAddress(
      params.linkdropMasterAddress,
      params.campaignId
    )

    logger.debug(`Proxy address computed: ${proxyAddress}`)
    params = {
      ...params,
      proxyAddress
    }

    // blockhain check that params are valid
    await proxyFactoryService.checkClaimParams(params)
    logger.debug('Blockchain params check passed. Submitting claim tx...')

    // save claim operation to database
    const claimId = this._computeId(params)
    logger.debug('Saving claim operation to database...')
    await operationService.create(claimId, 'claim', params, null)

    // send claim transaction to blockchain
    const tx = await proxyFactoryService.claim(params)
    logger.info('Submitted claim tx: ' + tx.hash)

    // add transaction details to database
    await operationService.addTransaction(claimId, tx)

    return tx.hash
  }

  _checkClaimParamsERC721 (params) {
    if (!params.weiAmount) {
      throw new BadRequestError('Please provide weiAmount argument')
    }
    if (!params.nftAddress) {
      throw new BadRequestError('Please provide nftAddress argument')
    }
    if (!params.tokenId) {
      throw new BadRequestError('Please provide tokenId argument')
    }
    if (!params.expirationTime) {
      throw new BadRequestError('Please provide expirationTime argument')
    }
    if (!params.version) {
      throw new BadRequestError('Please provide version argument')
    }
    if (!params.chainId) {
      throw new BadRequestError('Please provide chainId argument')
    }
    if (!params.linkId) {
      throw new BadRequestError('Please provide linkId argument')
    }
    if (!params.linkdropMasterAddress) {
      throw new BadRequestError('Please provide linkdropMasterAddress argument')
    }
    if (!params.linkdropSignerSignature) {
      throw new BadRequestError(
        'Please provide linkdropSignerSignature argument'
      )
    }
    if (!params.receiverAddress) {
      throw new BadRequestError('Please provide receiverAddress argument')
    }
    if (!params.receiverSignature) {
      throw new BadRequestError('Please provide receiverSignature argument')
    }

    if (!params.campaignId) {
      throw new BadRequestError('Please provide campaignId argument')
    }

    logger.debug('Valid claim params: ' + JSON.stringify(params))
  }

  async claimERC721 (params) {
    // Make sure all arguments are passed
    this._checkClaimParamsERC721(params)

    // Check whether a claim tx exists in database
    const claim = await this.findClaimInDB(params)
    if (claim) {
      logger.info(`Existing claim transaction found: ${claim.id}`)
      throw new Error('Claim link was already submitted')
    }
    logger.debug("Claim doesn't exist in database yet. Creating new claim...")

    // compute proxyAddress from master address
    const proxyAddress = await linkdropService.getProxyAddress(
      params.linkdropMasterAddress,
      params.campaignId
    )

    logger.debug(`Proxy address computed: ${proxyAddress}`)
    params = {
      ...params,
      proxyAddress
    }

    // blockhain check that params are valid
    await proxyFactoryService.checkClaimParamsERC721(params)
    logger.debug('Blockchain params check passed. Submitting claim tx...')

    // save claim operation to database
    const claimId = this._computeId(params)
    logger.debug('Saving claim operation to database...')
    await operationService.create(claimId, 'claim', params, null)

    // send claim transaction to blockchain
    const tx = await proxyFactoryService.claimERC721(params)
    logger.info('Submitted claim tx: ' + tx.hash)

    // add transaction details to database
    await operationService.addTransaction(claimId, tx)

    return tx.hash
  }
}

export default new ClaimService()
