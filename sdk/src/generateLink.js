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
