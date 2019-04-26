import { computeProxyAddress } from './computeProxyAddress'
import { generateLink, generateLinkERC721 } from './generateLink'
import { claim, claimERC721 } from './claim'

const LinkdropSDK = {
  computeProxyAddress,
  generateLink,
  generateLinkERC721,
  claim,
  claimERC721
}

module.exports = LinkdropSDK
