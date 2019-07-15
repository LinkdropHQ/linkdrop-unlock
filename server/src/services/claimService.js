import { BadRequestError } from '../utils/errors'
import logger from '../utils/logger'
import proxyFactoryService from './proxyFactoryService'
import operationService from './operationService'


class ClaimService {
  _computeId ({ linkId, linkdropMasterAddress }) {
    return `claim-${linkdropMasterAddress.toLowerCase()}-${linkId.toLowerCase()}`
  }
  
  // Check whether a claim tx exists in database
  findClaimInDB ({ linkId, linkdropMasterAddress }) {
    const id = this._computeId({ linkId, linkdropMasterAddress })
    return operationService.findById(id)
  }
  
  // Save claim operation to database
  async _saveClaimOperationToDB (claimParams, tx) {
    const id = this._computeId(claimParams)
    logger.debug('Saving claim operation to database...')
    const operation = await operationService.create(id, 'claim', claimParams, tx)

    logger.info(`Submitted claim transaction: ${tx.hash}`)

    return operation
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
      throw new BadRequestError('Please provide linkdropSignerSignature argument')
    }
    if (!params.receiverAddress) {
      throw new BadRequestError('Please provide receiverAddress argument')
    }
    if (!params.receiverSignature) {
      throw new BadRequestError('Please provide receiverSignature argument')
    }
    if (!params.isApprove) {
      throw new BadRequestError('Please provide isApprove argument')
    }
    if (String(params.isApprove) !== 'true' && String(params.isApprove) !== 'false') {
      throw new BadRequestError('Please provide valid isApprove argument')
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
    const proxyAddress = await proxyFactoryService.computeProxyAddress(params.linkdropMasterAddress)
    logger.debug(`Proxy address computed: ${proxyAddress}`)
    params = {
        ...params,
      proxyAddress
    }
    
    // blockhain check that params are valid
    await proxyFactoryService.checkClaimParams(params)
    logger.debug('Blockchain params check passed. Submitting claim tx...')

    // send claim transaction to blockchain
    const tx = await proxyFactoryService.claim(params)
    logger.info('Submitted claim tx: ' + tx.hash)
    logger.debug('Tx details: ' + JSON.stringify(tx))
    
    // save to db
    await this._saveClaimOperationToDB(params, tx)

    return tx.hash
  }
}

export default new ClaimService()
