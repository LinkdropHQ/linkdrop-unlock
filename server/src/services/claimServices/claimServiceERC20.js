import { BadRequestError } from '../../utils/errors'
import logger from '../../utils/logger'
import proxyFactoryService from '../proxyFactoryService'
import ClaimServiceBase from './claimServiceBase'

class ClaimServiceERC20 extends ClaimServiceBase {
  _checkClaimParams (params) {
    // check basic linkdrop params
    super._checkClaimParamsBase(params)

    // make erc20 specific checks
    if (!params.tokenAddress) {
      throw new BadRequestError('Please provide tokenAddress argument')
    }
    if (!params.tokenAmount) {
      throw new BadRequestError('Please provide tokenAddress argument')
    }
    logger.debug('Valid claim params: ' + JSON.stringify(params))
  }

  _checkParamsWithBlockchainCall (params) {
    return proxyFactoryService.checkClaimParams(params)
  }

  _sendClaimTx (params) {
    return proxyFactoryService.claim(params)
  }
}

export default new ClaimServiceERC20()
