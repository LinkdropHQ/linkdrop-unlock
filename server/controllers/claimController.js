import Factory from '../../contracts/build/Factory'
const ethers = require('ethers')
const path = require('path')
const configPath = path.resolve(__dirname, '../../config/config.json')
const config = require(configPath)
const { jsonRpcUrl, relayerPrivateKey, factory } = config
const provider = new ethers.providers.JsonRpcProvider(jsonRpcUrl)
const relayer = new ethers.Wallet(relayerPrivateKey, provider)
const LinkdropSDK = require('../../sdk/src/index')

export const claim = async (req, res) => {
  const {
    token,
    amount,
    expirationTime,
    linkId,
    senderAddress,
    senderSignature,
    receiverAddress,
    receiverSignature
  } = req.body

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

  if (!token) {
    throw new Error('Please provide token address')
  }

  if (!amount) {
    throw new Error('Please provide amount to claim')
  }

  if (!expirationTime) {
    throw new Error('Please provide expiration time')
  }

  if (!linkId) {
    throw new Error('Please provide the link id')
  }

  if (!senderAddress) {
    throw new Error(`Please provide sender's address`)
  }

  if (!senderSignature) {
    throw new Error('Please provide sender signature')
  }

  if (!receiverAddress) {
    throw new Error(`Please provide receiver's address`)
  }

  if (!receiverSignature) {
    throw new Error('Please provide receiver signature')
  }

  let proxyFactory = new ethers.Contract(factory, Factory.abi, relayer)

  try {
    let masterCopyAddr = await proxyFactory.masterCopy()

    let proxyAddr = await LinkdropSDK.computeProxyAddress(
      factory,
      senderAddress,
      masterCopyAddr
    )

    await proxyFactory.checkClaimParams(
      token,
      amount,
      expirationTime,
      linkId,
      senderAddress,
      senderSignature,
      receiverAddress,
      receiverSignature,
      proxyAddr
    )

    console.log('⌛️  Claiming...', claimParams)

    let tx = await proxyFactory.claim(
      token,
      amount,
      expirationTime,
      linkId,
      senderAddress,
      senderSignature,
      receiverAddress,
      receiverSignature,
      { gasLimit: 500000 }
    )

    console.log(`#️⃣  Tx Hash: ${tx.hash}`)

    res.json({
      success: true,
      txHash: tx.hash
    })
  } catch (err) {
    console.error(err)
  }
}

export const claimERC721 = async (req, res) => {
  const {
    nft,
    tokenId,
    expirationTime,
    linkId,
    senderAddress,
    senderSignature,
    receiverAddress,
    receiverSignature
  } = req.body

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

  if (!nft) {
    throw new Error('Please provide nft address')
  }

  if (!tokenId) {
    throw new Error('Please provide token id to claim')
  }

  if (!expirationTime) {
    throw new Error('Please provide expiration time')
  }

  if (!linkId) {
    throw new Error('Please provide the link id')
  }

  if (!senderAddress) {
    throw new Error(`Please provide sender's address`)
  }

  if (!senderSignature) {
    throw new Error('Please provide sender signature')
  }

  if (!receiverAddress) {
    throw new Error(`Please provide receiver's address`)
  }

  if (!receiverSignature) {
    throw new Error('Please provide receiver signature')
  }

  let proxyFactory = new ethers.Contract(factory, Factory.abi, relayer)

  try {
    let masterCopyAddr = await proxyFactory.masterCopy()

    let proxyAddr = await LinkdropSDK.computeProxyAddress(
      factory,
      senderAddress,
      masterCopyAddr
    )

    await proxyFactory.checkClaimParamsERC721(
      nft,
      tokenId,
      expirationTime,
      linkId,
      senderAddress,
      senderSignature,
      receiverAddress,
      receiverSignature,
      proxyAddr
    )

    console.log('⌛️  Claiming...', claimParams)

    let tx = await proxyFactory.claimERC721(
      nft,
      tokenId,
      expirationTime,
      linkId,
      senderAddress,
      senderSignature,
      receiverAddress,
      receiverSignature,
      { gasLimit: 500000 }
    )

    console.log(`#️⃣  Tx Hash: ${tx.hash}`)

    res.json({
      success: true,
      txHash: tx.hash
    })
  } catch (err) {
    console.error(err)
  }
}
