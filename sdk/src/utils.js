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

export const computeBytecode = masterCopyAddress => {
  const bytecode = `0x363d3d373d3d3d363d73${masterCopyAddress.slice(
    2
  )}5af43d82803e903d91602b57fd5bf3`
  return bytecode
}

// const initcode = '0x6352c7420d6000526103ff60206004601c335afa6040516060f3'
export const computeProxyAddress = (
  factoryAddress,
  linkdropSignerAddress,
  initcode
) => {
  if (factoryAddress == null || factoryAddress === '') {
    throw new Error('Please provide factory address')
  }

  if (linkdropSignerAddress == null || linkdropSignerAddress === '') {
    throw new Error('Please provide linkdropSigner address')
  }

  if (initcode == null || initcode === '') {
    throw new Error('Please provide initcode')
  }

  const salt = ethers.utils.solidityKeccak256(
    ['address'],
    [linkdropSignerAddress]
  )

  const proxyAddress = buildCreate2Address(factoryAddress, salt, initcode)
  return proxyAddress
}

// Generates new link for ETH and ERC20
export const createLink = async ({
  linkdropSigner, // Wallet
  weiAmount,
  tokenAddress,
  tokenAmount,
  expirationTime,
  version,
  chainId
}) => {
  let linkWallet = ethers.Wallet.createRandom()
  let linkKey = linkWallet.privateKey
  let linkId = linkWallet.address
  let linkdropSignerSignature = await signLink({
    linkdropSigner,
    weiAmount,
    tokenAddress,
    tokenAmount,
    expirationTime,
    version,
    chainId,
    linkId
  })
  return {
    linkKey, // link's ephemeral private key
    linkId, // address corresponding to link key
    linkdropSignerSignature // signed by linkdrop verifier
  }
}

// Should be signed by linkdropSigner (ETH, ERC20)
export const signLink = async ({
  linkdropSigner, // Wallet
  weiAmount,
  tokenAddress,
  tokenAmount,
  expirationTime,
  version,
  chainId,
  linkId
}) => {
  let messageHash = ethers.utils.solidityKeccak256(
    ['uint', 'address', 'uint', 'uint', 'uint', 'uint', 'address'],
    [
      weiAmount,
      tokenAddress,
      tokenAmount,
      expirationTime,
      version,
      chainId,
      linkId
    ]
  )
  let messageHashToSign = ethers.utils.arrayify(messageHash)
  let signature = await linkdropSigner.signMessage(messageHashToSign)
  return signature
}

// Generates new link for ERC721
export const createLinkERC721 = async ({
  linkdropSigner, // Wallet
  weiAmount,
  nftAddress,
  tokenId,
  expirationTime,
  version,
  chainId
}) => {
  let linkWallet = ethers.Wallet.createRandom()
  let linkKey = linkWallet.privateKey
  let linkId = linkWallet.address
  let linkdropSignerSignature = await signLinkERC721({
    linkdropSigner,
    weiAmount,
    nftAddress,
    tokenId,
    expirationTime,
    version,
    chainId,
    linkId
  })
  return {
    linkKey, // link's ephemeral private key
    linkId, // address corresponding to link key
    linkdropSignerSignature // signed by linkdrop verifier
  }
}

// Should be signed by linkdropSigner (ERC721)
export const signLinkERC721 = async ({
  linkdropSigner, // Wallet
  weiAmount,
  nftAddress,
  tokenId,
  expirationTime,
  version,
  chainId,
  linkId
}) => {
  let messageHash = ethers.utils.solidityKeccak256(
    ['uint', 'address', 'uint', 'uint', 'uint', 'uint', 'address'],
    [weiAmount, nftAddress, tokenId, expirationTime, version, chainId, linkId]
  )
  let messageHashToSign = ethers.utils.arrayify(messageHash)
  let signature = await linkdropSigner.signMessage(messageHashToSign)
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
