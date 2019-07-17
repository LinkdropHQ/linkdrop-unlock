import { BadRequestError } from '../../utils/errors'
import logger from '../utils/logger'
import proxyFactoryService from '../proxyFactoryService'
import ClaimServiceBase from './claimServiceBase'


class ClaimServiceERC721 extends ClaimServiceBase {
  _checkClaimParamsERC721 (params) {
    // check basic linkdrop params
    super._checkClaimParams(params)

    // make erc20 specific checks    
    if (!params.nftAddress) {
      throw new BadRequestError('Please provide nftAddress argument')
    }
    if (!params.tokenId) {
      throw new BadRequestError('Please provide tokenId argument')
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

export default new ClaimServiceERC721()
