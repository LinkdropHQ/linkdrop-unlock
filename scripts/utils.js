import { utils } from 'ethers'
const ethers = require('ethers')

function buildCreate2Address (creatorAddress, saltHex, byteCode) {
  const byteCodeHash = utils.keccak256(byteCode)
  return `0x${utils
    .keccak256(
      `0x${['ff', creatorAddress, saltHex, byteCodeHash]
        .map(x => x.replace(/0x/, ''))
        .join('')}`
    )
    .slice(-40)}`.toLowerCase()
}

export const computeProxyAddress = (
  factoryAddress,
  senderAddress,
  implementation
) => {
  const salt = utils.solidityKeccak256(['address'], [senderAddress])

  const bytecode = `0x3d602d80600a3d3981f3363d3d373d3d3d363d73${implementation.slice(
    2
  )}5af43d82803e903d91602b57fd5bf3`

  const proxyAddress = buildCreate2Address(factoryAddress, salt, bytecode)

  // console.log({
  //   salt,
  //   factoryAddress,
  //   proxyAddress
  // })
  return proxyAddress
}

// Should be signed by sender
export const signLink = async function (
  sender, // Wallet
  tokenAddress,
  claimAmount,
  expirationTime,
  linkId
) {
  let messageHash = ethers.utils.solidityKeccak256(
    ['address', 'uint', 'uint', 'address'],
    [tokenAddress, claimAmount, expirationTime, linkId]
  )
  let messageHashToSign = ethers.utils.arrayify(messageHash)
  let signature = await sender.signMessage(messageHashToSign)
  return signature
}

// Generates new link
export const createLink = async function (
  sender, // Wallet
  tokenAddress,
  claimAmount,
  expirationTime
) {
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

export const signReceiverAddress = async function (linkKey, receiverAddress) {
  let wallet = new ethers.Wallet(linkKey)
  let messageHash = ethers.utils.solidityKeccak256(
    ['address'],
    [receiverAddress]
  )
  let messageHashToSign = ethers.utils.arrayify(messageHash)
  let signature = await wallet.signMessage(messageHashToSign)
  return signature
}

export const getMasterCopyAddress = () => {
  let masterCopyAddress = process.env.LINKDROP_MASTER_COPY
  if (masterCopyAddress == null || masterCopyAddress === '') {
    throw 'Please provide linkdrop master copy address'
  }
  return masterCopyAddress
}

export const getFactoryAddress = () => {
  let factoryAddress = process.env.FACTORY
  if (factoryAddress == null || factoryAddress === '') {
    throw 'Please provide factory contract address'
  }
  return factoryAddress
}
