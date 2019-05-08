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
      if (response.data.success === true) {
        console.log(
          '\n✅  Claim tx has been submitted. Please verify the claim status manually.'
        )
        const txHash = response.data.txHash
        console.log(`#️⃣  Tx Hash: ${txHash}`)
        return txHash
      } else {
        const error = response.data.error.reason
        console.error(`🆘  Request failed with '${error}'`)
        return error
      }
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
      if (response.data.success === true) {
        console.log(
          '\n✅  Claim tx has been submitted. Please verify the claim status manually.'
        )
        const txHash = response.data.txHash
        console.log(`#️⃣  Tx Hash: ${txHash}`)
        return txHash
      } else {
        const error = response.data.error.reason
        console.error(`🆘  Request failed with '${error}'`)
        return error
      }
    }
  } catch (err) {
    console.error(err)
  }
}
