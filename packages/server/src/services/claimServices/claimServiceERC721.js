import { BadRequestError } from '../../utils/errors'
import logger from '../../utils/logger'
import proxyFactoryService from '../proxyFactoryService'
import ClaimServiceBase from './claimServiceBase'

class ClaimServiceERC721 extends ClaimServiceBase {
  _checkClaimParams (params) {
    // check basic linkdrop params
    super._checkClaimParamsBase(params)

    // make erc721 specific checks
    if (!params.nftAddress) {
      throw new BadRequestError('Please provide nftAddress argument')
    }
    if (!params.tokenId) {
      throw new BadRequestError('Please provide tokenId argument')
    }
    logger.debug('Valid claim params: ' + JSON.stringify(params))
  }

  _checkParamsWithBlockchainCall (params) {
    return proxyFactoryService.checkClaimParamsERC721(params)
  }

  _sendClaimTx (params) {
    return proxyFactoryService.claimERC721(params)
  }
}

export default new ClaimServiceERC721()
