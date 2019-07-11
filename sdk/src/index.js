import { computeProxyAddress } from './utils'
import * as generateLinkUtils from './generateLink'
import * as claimUtils from './claim'

import LinkdropFactory from '../../contracts/build/LinkdropFactory'
import { ethers } from 'ethers'

const LinkdropSDK = ({
  linkdropMasterAddress,
  chain = 'mainnet',
  chainId = getChainId(chain),
  jsonRpcUrl = `https://${chain}.infura.io`,
  apiHost = `https://${chain}.linkdrop.io`,
  claimHost = 'https://claim.linkdrop.io',
  factory = '0xDEF008f43a36ba4D3523d2e26eF1A6d4C83b4df8'
}) => {
  if (linkdropMasterAddress == null || linkdropMasterAddress === '') {
    throw new Error('Please provide linkdrop master address')
  }

  if (chainId == null) {
    throw new Error('Please provide valid chain and/or chain id')
  }

  let version
  const provider = new ethers.providers.JsonRpcProvider(jsonRpcUrl)
  const factoryContract = new ethers.Contract(
    factory,
    LinkdropFactory.abi,
    provider
  )

  const getVersion = async () => {
    return factoryContract.getProxyMasterCopyVersion(linkdropMasterAddress)
  }

  const generateLink = async ({
    signingKeyOrWallet,
    weiAmount,
    tokenAddress,
    tokenAmount,
    expirationTime = 12345678910,
    isApprove = true
  }) => {
    return generateLinkUtils.generateLink({
      chainId,
      host: claimHost,
      linkdropMasterAddress,
      signingKeyOrWallet,
      weiAmount,
      tokenAddress,
      tokenAmount,
      expirationTime,
      version: version || (await getVersion()),
      isApprove
    })
  }

  const generateLinkERC721 = async ({
    signingKeyOrWallet,
    weiAmount,
    nftAddress,
    tokenId,
    expirationTime = 12345678910,
    isApprove = true
  }) => {
    return generateLinkUtils.generateLinkERC721({
      chainId,
      host: claimHost,
      linkdropMasterAddress,
      signingKeyOrWallet,
      weiAmount,
      nftAddress,
      tokenId,
      expirationTime,
      version: version || (await getVersion()),
      isApprove
    })
  }

  const getProxyAddress = () => {
    return computeProxyAddress(factory, linkdropMasterAddress)
  }

  const claim = async ({
    weiAmount,
    tokenAddress,
    tokenAmount,
    expirationTime = 12345678910,
    version,
    chainId,
    linkKey,
    linkdropSignerSignature,
    receiverAddress,
    isApprove = true
  }) => {
    return claimUtils.claim({
      jsonRpcUrl,
      apiHost,
      weiAmount,
      tokenAddress,
      tokenAmount,
      expirationTime,
      version,
      chainId,
      linkKey,
      linkdropMasterAddress,
      linkdropSignerSignature,
      receiverAddress,
      isApprove
    })
  }

  const claimERC721 = async ({
    weiAmount,
    nftAddress,
    tokenId,
    expirationTime = 12345678910,
    version,
    chainId,
    linkKey,
    linkdropSignerSignature,
    receiverAddress,
    isApprove = true
  }) => {
    return claimUtils.claimERC721({
      jsonRpcUrl,
      apiHost,
      weiAmount,
      nftAddress,
      tokenId,
      expirationTime,
      version,
      chainId,
      linkKey,
      linkdropMasterAddress,
      linkdropSignerSignature,
      receiverAddress,
      isApprove
    })
  }

  return {
    getProxyAddress,
    computeProxyAddress,
    generateLink,
    generateLinkERC721,
    claim,
    claimERC721
  }
}

const getChainId = chain => {
  let chainId
  switch (chain) {
    case 'mainnet':
      chainId = 1
      break
    case 'ropsten':
      chainId = 3
      break
    case 'rinkeby':
      chainId = 4
      break
    default:
      chainId = null
  }
  return chainId
}

export default LinkdropSDK
