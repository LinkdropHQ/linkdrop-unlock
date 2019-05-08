import { createLink } from './utils'
const ethers = require('ethers')

export const generateLink = async (
  jsonRpcUrl,
  networkId,
  host,
  senderPrivateKey,
  token,
  amount,
  expirationTime
) => {
  if (jsonRpcUrl == null || jsonRpcUrl === '') {
    throw new Error('Please provide json rpc url')
  }

  if (networkId == null || networkId === '') {
    throw new Error('Please provide networkId')
  }

  if (host == null || host === '') {
    throw new Error('Please provide host')
  }

  if (senderPrivateKey == null || senderPrivateKey === '') {
    throw new Error(`Please provide sender's private key`)
  }

  if (token == null || token === '') {
    throw new Error('Please provide ERC20 token address')
  }

  if (amount === null || amount === '') {
    throw new Error('Please provide amount per link')
  }

  if (expirationTime == null || expirationTime === '') {
    throw new Error('Please provide expiration time')
  }
  const provider = new ethers.providers.JsonRpcProvider(jsonRpcUrl)
  const sender = new ethers.Wallet(senderPrivateKey, provider)
  const { linkKey, linkId, senderSignature } = await createLink(
    sender,
    token,
    amount,
    expirationTime
  )

  // Construct link
  let url = `${host}/#/receive?token=${token}&amount=${amount}&expirationTime=${expirationTime}&linkKey=${linkKey}&senderAddress=${
    sender.address
  }&senderSignature=${senderSignature}`

  // Add network param to url if not mainnet
  if (String(networkId) !== '1') {
    url = `${url}&n=${networkId}`
  }

  return { url, linkId, linkKey, senderSignature }
}

export const generateLinkERC721 = async (
  jsonRpcUrl,
  networkId,
  host,
  senderPrivateKey,
  nft,
  tokenId,
  expirationTime
) => {
  if (jsonRpcUrl == null || jsonRpcUrl === '') {
    throw new Error('Please provide json rpc url')
  }

  if (networkId == null || networkId === '') {
    throw new Error('Please provide networkId')
  }

  if (host == null || host === '') {
    throw new Error('Please provide host')
  }

  if (senderPrivateKey == null || senderPrivateKey === '') {
    throw new Error(`Please provide sender's private key`)
  }

  if (nft == null || nft === '' || nft === ethers.constants.AddressZero) {
    throw new Error('Please provide ERC721 token address')
  }

  if (tokenId == null || tokenId === '') {
    throw new Error('Please provide token id to claim')
  }

  if (expirationTime == null || expirationTime === '') {
    throw new Error('Please provide expiration time')
  }

  const provider = new ethers.providers.JsonRpcProvider(jsonRpcUrl)
  const sender = new ethers.Wallet(senderPrivateKey, provider)
  const { linkKey, linkId, senderSignature } = await createLink(
    sender,
    nft,
    tokenId,
    expirationTime
  )

  // Construct link
  let url = `${host}/#/receive?nft=${nft}&tokenId=${tokenId}&expirationTime=${expirationTime}&linkKey=${linkKey}&senderAddress=${
    sender.address
  }&senderSignature=${senderSignature}`

  // Add network param to url if not mainnet
  if (String(networkId) !== '1') {
    url = `${url}&n=${networkId}`
  }

  return { url, linkId, linkKey, senderSignature }
}
