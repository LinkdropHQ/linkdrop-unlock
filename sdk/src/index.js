import {
  computeProxyAddress,
  computeBytecode,
  createLink,
  signLink,
  signReceiverAddress
} from './utils'
import { generateLink, generateLinkERC721 } from './generateLink'
import { generateLinkWeb3, generateLinkERC721Web3 } from './generateLinkWeb3'
import { claim, claimERC721 } from './claim'

const LinkdropSDK = {
  computeProxyAddress,
  computeBytecode,
  createLink,
  signLink,
  signReceiverAddress,
  generateLink,
  generateLinkERC721,
  generateLinkWeb3,
  generateLinkERC721Web3,
  claim,
  claimERC721
}

export default LinkdropSDK
