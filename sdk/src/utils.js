const ethers = require('ethers')

export const buildCreate2Address = (creatorAddress, saltHex, byteCode) => {
  const byteCodeHash = ethers.utils.keccak256(byteCode)
  return `0x${ethers.utils
    .keccak256(
      `0x${['ff', creatorAddress, saltHex, byteCodeHash]
        .map(x => x.replace(/0x/, ''))
        .join('')}`
    )
    .slice(-40)}`.toLowerCase()
}

// Generates new link
export const createLink = async (
  sender, // Wallet
  tokenAddress,
  claimAmount,
  expirationTime
) => {
  let linkWallet = ethers.Wallet.createRandom()
  let linkKey = linkWallet.privateKey
  let linkId = linkWallet.address
  let senderSignature = await signLink(
    sender,
    tokenAddress,
    claimAmount,
    expirationTime,
    linkId
  )
  return {
    linkKey, // link's ephemeral private key
    linkId, // address corresponding to link key
    senderSignature // signed by linkdrop verifier
  }
}

// Should be signed by sender
export const signLink = async (
  sender, // Wallet
  tokenAddress,
  claimAmount,
  expirationTime,
  linkId
) => {
  let messageHash = ethers.utils.solidityKeccak256(
    ['address', 'uint', 'uint', 'address'],
    [tokenAddress, claimAmount, expirationTime, linkId]
  )
  let messageHashToSign = ethers.utils.arrayify(messageHash)
  let signature = await sender.signMessage(messageHashToSign)
  return signature
}

export const signReceiverAddress = async (linkKey, receiverAddress) => {
  let wallet = new ethers.Wallet(linkKey)
  let messageHash = ethers.utils.solidityKeccak256(
    ['address'],
    [receiverAddress]
  )
  let messageHashToSign = ethers.utils.arrayify(messageHash)
  let signature = await wallet.signMessage(messageHashToSign)
  return signature
}
