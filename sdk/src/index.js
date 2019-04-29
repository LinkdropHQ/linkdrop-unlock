import { computeProxyAddress } from './computeProxyAddress'
import { generateLink, generateLinkERC721 } from './generateLink'
import { claim } from './claim'

const LinkdropSDK = {
  computeProxyAddress,
  generateLink,
  generateLinkERC721,
  claim
}

module.exports = LinkdropSDK
