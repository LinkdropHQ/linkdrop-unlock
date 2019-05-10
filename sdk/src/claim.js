import { signReceiverAddress } from './utils'
const ethers = require('ethers')
const axios = require('axios')

export const claim = async (
  jsonRpcUrl,
  host,
  token,
  amount,
  expirationTime,
  linkKey,
  senderAddress,
  senderSignature,
  receiverAddress
) => {
  if (jsonRpcUrl == null || jsonRpcUrl === '') {
    throw new Error('Please provide json rpc url')
  }

  if (host == null || host === '') {
    throw new Error('Please provide host')
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

  if (linkKey == null || linkKey === '') {
    throw new Error('Please provide link key')
  }

  if (senderAddress == null || senderAddress === '') {
    throw new Error('Please provide sender address')
  }

  if (senderSignature == null || senderSignature === '') {
    throw new Error('Please provide sender signature')
  }

  if (receiverAddress == null || receiverAddress === '') {
    throw new Error('Please provide receiver address')
  }

  // Get provider
  const provider = new ethers.providers.JsonRpcProvider(jsonRpcUrl)

  // Get receiver signature
  const receiverSignature = await signReceiverAddress(linkKey, receiverAddress)

  // Get linkId from linkKey
  const linkId = new ethers.Wallet(linkKey, provider).address

  const claimParams = {
    token,
    amount,
    expirationTime,
    linkId,
    senderAddress,
    senderSignature,
    receiverAddress,
    receiverSignature
  }
  try {
    const response = await axios.post(
      `${host}/api/v1/linkdrops/claim`,
      claimParams
    )
    if (response.status !== 200) {
      console.error(`\n❌ Invalid response status ${response.status}`)
    } else {
      console.log(
        '\n✅  Claim tx has been submitted. Please verify the claim status manually.'
      )

      let txHash = response.data.txHash
      console.log(`#️⃣  Tx Hash: ${txHash}`)
      return txHash
    }
  } catch (err) {
    console.error(err)
  }
}

export const claimERC721 = async (
  jsonRpcUrl,
  host,
  nft,
  tokenId,
  expirationTime,
  linkKey,
  senderAddress,
  senderSignature,
  receiverAddress
) => {
  if (jsonRpcUrl == null || jsonRpcUrl === '') {
    throw new Error('Please provide json rpc url')
  }

  if (host == null || host === '') {
    throw new Error('Please provide host')
  }

  if (nft == null || nft === '' || nft === ethers.constants.AddressZero) {
    throw new Error('Please provide ERC721 token address')
  }

  if (tokenId === null || tokenId === '') {
    throw new Error('Please provide token id to claim')
  }

  if (expirationTime == null || expirationTime === '') {
    throw new Error('Please provide expiration time')
  }

  if (linkKey == null || linkKey === '') {
    throw new Error('Please provide link key')
  }

  if (senderAddress == null || senderAddress === '') {
    throw new Error('Please provide sender address')
  }

  if (senderSignature == null || senderSignature === '') {
    throw new Error('Please provide sender signature')
  }

  if (receiverAddress == null || receiverAddress === '') {
    throw new Error('Please provide receiver address')
  }

  // Get provider
  const provider = new ethers.providers.JsonRpcProvider(jsonRpcUrl)

  // Get receiver signature
  const receiverSignature = await signReceiverAddress(linkKey, receiverAddress)

  // Get linkId from linkKey
  const linkId = new ethers.Wallet(linkKey, provider).address

  const claimParams = {
    nft,
    tokenId,
    expirationTime,
    linkId,
    senderAddress,
    senderSignature,
    receiverAddress,
    receiverSignature
  }
  try {
    const response = await axios.post(
      `${host}/api/v1/linkdrops/claim-erc721`,
      claimParams
    )
    if (response.status !== 200) {
      console.error(`\n❌ Invalid response status ${response.status}`)
    } else {
      console.log(
        '\n✅  Claim tx has been submitted. Please verify the claim status manually.'
      )

      let txHash = response.data.txHash
      console.log(`#️⃣  Tx Hash: ${txHash}`)
      return txHash
    }
  } catch (err) {
    console.error(err)
  }
}
