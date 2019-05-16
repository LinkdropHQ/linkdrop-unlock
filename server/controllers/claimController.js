import LinkdropFactory from '../../contracts/build/LinkdropFactory'
import LinkdropSDK from '../../sdk/src/index'
import ClaimTx from '../models/claimTx'
import ClaimTxERC721 from '../models/claimTxERC721'

const ethers = require('ethers')
const path = require('path')
const configPath = path.resolve(__dirname, '../../config/server.config.json')
const config = require(configPath)
const { jsonRpcUrl, factory, relayerPrivateKey } = config
const provider = new ethers.providers.JsonRpcProvider(jsonRpcUrl)
const relayer = new ethers.Wallet(relayerPrivateKey, provider)

export const claim = async (req, res) => {
  const {
    weiAmount,
    tokenAddress,
    tokenAmount,
    expirationTime,
    linkId,
    linkdropSignerAddress,
    linkdropSignerSignature,
    receiverAddress,
    receiverSignature
  } = req.body

  const claimParams = {
    weiAmount,
    tokenAddress,
    tokenAmount,
    expirationTime,
    linkId,
    linkdropSignerAddress,
    linkdropSignerSignature,
    receiverAddress,
    receiverSignature
  }

  if (!weiAmount) {
    throw new Error('Please provide amount of eth to claim')
  }

  if (!tokenAddress) {
    throw new Error('Please provide token address')
  }

  if (!tokenAmount) {
    throw new Error('Please provide amount of tokens to claim')
  }

  if (!expirationTime) {
    throw new Error('Please provide expiration time')
  }

  if (!linkId) {
    throw new Error('Please provide the link id')
  }

  if (!linkdropSignerAddress) {
    throw new Error(`Please provide linkdropSigner's address`)
  }

  if (!linkdropSignerSignature) {
    throw new Error('Please provide linkdropSigner signature')
  }

  if (!receiverAddress) {
    throw new Error(`Please provide receiver's address`)
  }

  if (!receiverSignature) {
    throw new Error('Please provide receiver signature')
  }

  const proxyFactory = new ethers.Contract(
    factory,
    LinkdropFactory.abi,
    relayer
  )

  try {
    const masterCopyAddress = await proxyFactory.masterCopy()

    const proxyAddress = await LinkdropSDK.computeProxyAddress(
      factory,
      linkdropSignerAddress,
      masterCopyAddress
    )

    // Check whether a claim tx exists in database
    const oldClaimTx = await ClaimTx.findOne({
      weiAmount,
      tokenAddress,
      tokenAmount,
      linkId,
      linkdropSignerAddress
    })

    if (oldClaimTx && oldClaimTx.txHash) {
      return res.json({
        success: true,
        txHash: oldClaimTx.txHash
      })
    }

    // Check claim params
    try {
      await proxyFactory.checkClaimParams(
        weiAmount,
        tokenAddress,
        tokenAmount,
        expirationTime,
        linkId,
        linkdropSignerAddress,
        linkdropSignerSignature,
        receiverAddress,
        receiverSignature,
        proxyAddress
      )

      // Claim
      console.log('\n🔦️  Claiming...\n', claimParams)

      const tx = await proxyFactory.claim(
        weiAmount,
        tokenAddress,
        tokenAmount,
        expirationTime,
        linkId,
        linkdropSignerAddress,
        linkdropSignerSignature,
        receiverAddress,
        receiverSignature,
        { gasLimit: 500000 }
      )

      const txHash = tx.hash

      console.log(`#️⃣  Tx Hash: ${txHash}`)

      // Save claim tx to database
      const claimTx = new ClaimTx({
        weiAmount,
        tokenAddress,
        tokenAmount,
        expirationTime,
        linkId,
        linkdropSignerAddress,
        receiverAddress,
        proxyAddress,
        txHash
      })

      const document = await claimTx.save()
      console.log(
        `🔋  Saved claim tx with document id = ${document.id} to database`
      )

      res.json({
        success: true,
        txHash: txHash
      })
    } catch (error) {
      if (error.reason) console.error(`📛  Failed with '${error.reason}'`)
      else console.error(error)

      return res.json({
        success: false,
        error: error
      })
    }
  } catch (err) {
    console.error(err)
  }
}

export const claimERC721 = async (req, res) => {
  const {
    weiAmount,
    nftAddress,
    tokenId,
    expirationTime,
    linkId,
    linkdropSignerAddress,
    linkdropSignerSignature,
    receiverAddress,
    receiverSignature
  } = req.body

  const claimParams = {
    weiAmount,
    nftAddress,
    tokenId,
    expirationTime,
    linkId,
    linkdropSignerAddress,
    linkdropSignerSignature,
    receiverAddress,
    receiverSignature
  }

  if (!weiAmount) {
    throw new Error('Please provide amount of eth to claim')
  }

  if (!nftAddress) {
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

  if (!linkdropSignerAddress) {
    throw new Error(`Please provide linkdropSigner's address`)
  }

  if (!linkdropSignerSignature) {
    throw new Error('Please provide linkdropSigner signature')
  }

  if (!receiverAddress) {
    throw new Error(`Please provide receiver's address`)
  }

  if (!receiverSignature) {
    throw new Error('Please provide receiver signature')
  }

  const proxyFactory = new ethers.Contract(
    factory,
    LinkdropFactory.abi,
    relayer
  )

  try {
    const masterCopyAddress = await proxyFactory.masterCopy()

    const proxyAddress = await LinkdropSDK.computeProxyAddress(
      factory,
      linkdropSignerAddress,
      masterCopyAddress
    )

    // Check whether a claim tx exists in database

    const oldClaimTx = await ClaimTxERC721.findOne({
      weiAmount,
      nftAddress,
      tokenId,
      linkId,
      linkdropSignerAddress
    })

    if (oldClaimTx && oldClaimTx.txHash) {
      return res.json({
        success: true,
        txHash: oldClaimTx.txHash
      })
    }

    // Check claim params
    try {
      await proxyFactory.checkClaimParamsERC721(
        weiAmount,
        nftAddress,
        tokenId,
        expirationTime,
        linkId,
        linkdropSignerAddress,
        linkdropSignerSignature,
        receiverAddress,
        receiverSignature,
        proxyAddress
      )

      // Claim
      console.log('\n🔦️  Claiming...\n', claimParams)

      const tx = await proxyFactory.claimERC721(
        weiAmount,
        nftAddress,
        tokenId,
        expirationTime,
        linkId,
        linkdropSignerAddress,
        linkdropSignerSignature,
        receiverAddress,
        receiverSignature,
        { gasLimit: 500000 }
      )
      const txHash = tx.hash

      console.log(`#️⃣  Tx Hash: ${txHash}`)

      // Save claim tx to database
      const claimTxERC721 = new ClaimTxERC721({
        weiAmount,
        nftAddress,
        tokenId,
        expirationTime,
        linkId,
        linkdropSignerAddress,
        receiverAddress,
        proxyAddress,
        txHash
      })

      const document = await claimTxERC721.save()
      console.log(
        `🔋  Saved claim tx with document id = ${document.id} to database`
      )

      res.json({
        success: true,
        txHash: tx.hash
      })
    } catch (error) {
      if (error.reason) console.error(`📛  Failed with '${error.reason}'`)
      else console.error(error)

      return res.json({
        success: false,
        error: error
      })
    }
  } catch (err) {
    console.error(err)
  }
}
