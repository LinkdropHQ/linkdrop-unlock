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
    campaignId
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
      version: version || (await getVersion())
    })
  }

  const generateLinkERC721 = async ({
    signingKeyOrWallet,
    weiAmount,
    nftAddress,
    tokenId,
    expirationTime = 12345678910
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
      version: version || (await getVersion())
    })
  }

  const getProxyAddress = (campaingId = 0) => {
    return computeProxyAddress(factory, linkdropMasterAddress, campaingId)
  }

  const claim = async ({
    weiAmount,
    tokenAddress,
    tokenAmount,
    expirationTime = 12345678910,
    linkKey,
    linkdropSignerSignature,
    receiverAddress,
    campaignId = 0
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
      campaignId
    })
  }

  const claimERC721 = async ({
    weiAmount,
    nftAddress,
    tokenId,
    expirationTime = 12345678910,
    linkKey,
    linkdropSignerSignature,
    receiverAddress,
    campaignId = 0
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
      campaignId
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
