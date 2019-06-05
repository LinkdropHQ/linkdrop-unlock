import { createLink, createLinkERC721 } from './utils'
const ethers = require('ethers')

export const generateLink = async ({
  jsonRpcUrl,
  chainId,
  host,
  linkdropMasterPrivateKey,
  weiAmount,
  tokenAddress,
  tokenAmount,
  expirationTime,
  version,
  isApprove
}) => {
  if (jsonRpcUrl === null || jsonRpcUrl === '') {
    throw new Error('Please provide json rpc url')
  }

  if (chainId === null || chainId === '') {
    throw new Error('Please provide chainId')
  }

  if (host === null || host === '') {
    throw new Error('Please provide host')
  }

  if (linkdropMasterPrivateKey === null || linkdropMasterPrivateKey === '') {
    throw new Error(`Please provide linkdropMaster's private key`)
  }

  if (weiAmount === null || weiAmount === '') {
    throw new Error('Please provide amount of eth to claim')
  }

  if (tokenAddress === null || tokenAddress === '') {
    throw new Error('Please provide ERC20 token address')
  }

  if (tokenAmount === null || tokenAmount === '') {
    throw new Error('Please provide amount of tokens to claim')
  }

  if (expirationTime === null || expirationTime === '') {
    throw new Error('Please provide expiration time')
  }

  if (version === null || version === '') {
    throw new Error('Please provide contract version')
  }

  if (isApprove) {
    if (String(isApprove) !== 'true' && String(isApprove) !== 'false') {
      throw new Error('Please provide valid isApprove argument')
    }
  }

  const provider = new ethers.providers.JsonRpcProvider(jsonRpcUrl)
  const linkdropMaster = new ethers.Wallet(linkdropMasterPrivateKey, provider)
  const { linkKey, linkId, linkdropSignerSignature } = await createLink({
    linkdropSigner: linkdropMaster,
    weiAmount,
    tokenAddress,
    tokenAmount,
    expirationTime,
    version,
    chainId
  })

  // Construct link
  let url = `${host}/#/receive?weiAmount=${weiAmount}&tokenAddress=${tokenAddress}&tokenAmount=${tokenAmount}&expirationTime=${expirationTime}&version=${version}&chainId=${chainId}&&linkKey=${linkKey}&linkdropMasterAddress=${
    linkdropMaster.address
  }&linkdropSignerSignature=${linkdropSignerSignature}`

  // Add isApprove param to url
  if (String(isApprove) === 'true') {
    url = `${url}&isApprove=${isApprove}`
  }

  return { url, linkId, linkKey, linkdropSignerSignature }
}

export const generateLinkERC721 = async ({
  jsonRpcUrl,
  chainId,
  host,
  linkdropMasterPrivateKey,
  weiAmount,
  nftAddress,
  tokenId,
  expirationTime,
  version,
  isApprove
}) => {
  if (jsonRpcUrl === null || jsonRpcUrl === '') {
    throw new Error('Please provide json rpc url')
  }

  if (chainId === null || chainId === '') {
    throw new Error('Please provide chain id')
  }

  if (host === null || host === '') {
    throw new Error('Please provide host')
  }

  if (linkdropMasterPrivateKey === null || linkdropMasterPrivateKey === '') {
    throw new Error(`Please provide linkdropMaster's private key`)
  }

  if (weiAmount === null || weiAmount === '') {
    throw new Error('Please provide amount of eth to claim')
  }

  if (
    nftAddress === null ||
    nftAddress === '' ||
    nftAddress === ethers.constants.AddressZero
  ) {
    throw new Error('Please provide ERC721 token address')
  }

  if (tokenId === null || tokenId === '') {
    throw new Error('Please provide token id to claim')
  }

  if (expirationTime === null || expirationTime === '') {
    throw new Error('Please provide expiration time')
  }

  if (version === null || version === '') {
    throw new Error('Please provide contract version')
  }

  if (isApprove) {
    if (String(isApprove) !== 'true' && String(isApprove) !== 'false') {
      throw new Error('Please provide valid isApprove argument')
    }
  }

  const provider = new ethers.providers.JsonRpcProvider(jsonRpcUrl)
  const linkdropMaster = new ethers.Wallet(linkdropMasterPrivateKey, provider)

  const { linkKey, linkId, linkdropSignerSignature } = await createLinkERC721({
    linkdropSigner: linkdropMaster,
    weiAmount,
    nftAddress,
    tokenId,
    expirationTime,
    version,
    chainId
  })

  // Construct link
  let url = `${host}/#/receive?weiAmount=${weiAmount}&nftAddress=${nftAddress}&tokenId=${tokenId}&expirationTime=${expirationTime}&version=${version}&chainId=${chainId}&linkKey=${linkKey}&linkdropMasterAddress=${
    linkdropMaster.address
  }&linkdropSignerSignature=${linkdropSignerSignature}`

  // Add isApprove param to url
  if (String(isApprove) === 'true') {
    url = `${url}&isApprove=${isApprove}`
  }

  return { url, linkId, linkKey, linkdropSignerSignature }
}
