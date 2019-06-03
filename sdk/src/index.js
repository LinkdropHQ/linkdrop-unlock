import { computeProxyAddress, computeBytecode } from './utils'
import { generateLink, generateLinkERC721 } from './generateLink'
import { claim, claimERC721 } from './claim'

const LinkdropSDK = {
  computeProxyAddress,
  computeBytecode,
  generateLink,
  generateLinkERC721,
  claim,
  claimERC721
}

export default LinkdropSDK
