import LinkdropFactory from '../../contracts/build/LinkdropFactory'
import LinkdropSDK from '../../sdk/src/index'
import ClaimTx from '../models/claimTx'
import ClaimTxERC721 from '../models/claimTxERC721'
import { newError } from '../../scripts/src/utils'

import { terminal as term } from 'terminal-kit'
const ethers = require('ethers')
ethers.errors.setLogLevel('error')

const path = require('path')
const configPath = path.resolve(__dirname, '../../configs/server.config.json')
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
    version,
    chainId,
    linkId,
    linkdropMasterAddress,
    linkdropSignerSignature,
    receiverAddress,
    receiverSignature,
    isApprove
  } = req.body

  const claimParams = {
    weiAmount,
    tokenAddress,
    tokenAmount,
    expirationTime,
    linkId,
    linkdropMasterAddress,
    linkdropSignerSignature,
    receiverAddress,
    receiverSignature
  }

  if (!weiAmount) {
    throw newError('Please provide amount of eth to claim')
  }

  if (!tokenAddress) {
    throw newError('Please provide token address')
  }

  if (!tokenAmount) {
    throw newError('Please provide amount of tokens to claim')
  }

  if (!expirationTime) {
    throw newError('Please provide expiration time')
  }

  if (!version) {
    throw newError('Please provide mastercopy version ')
  }

  if (!chainId) {
    throw newError('Please provide chain id')
  }

  if (!linkId) {
    throw newError('Please provide the link id')
  }

  if (!linkdropMasterAddress) {
    throw newError(`Please provide linkdrop master's address`)
  }

  if (!linkdropSignerSignature) {
    throw newError(`Please provide linkdrop signer's signature`)
  }

  if (!receiverAddress) {
    throw newError(`Please provide receiver's address`)
  }

  if (!receiverSignature) {
    throw newError('Please provide receiver signature')
  }

  if (isApprove) {
    if (String(isApprove) !== 'true' && String(isApprove) !== 'false') {
      throw newError('Please provide valid isApprove argument')
    }
  }

  const proxyFactory = new ethers.Contract(
    factory,
    LinkdropFactory.abi,
    relayer
  )

  try {
    const initcode = await proxyFactory.getInitcode()

    const proxyAddress = await LinkdropSDK.computeProxyAddress(
      factory,
      linkdropMasterAddress,
      initcode
    )

    // Check whether a claim tx exists in database
    const oldClaimTx = await ClaimTx.findOne({
      weiAmount,
      tokenAddress,
      tokenAmount,
      expirationTime,
      version,
      chainId,
      linkId,
      linkdropMasterAddress,
      receiverAddress
    })

    if (oldClaimTx && oldClaimTx.txHash) {
      return res.json({
        success: true,
        txHash: oldClaimTx.txHash
      })
    }

    try {
      let tx, txHash

      // Top up pattern
      if (!isApprove || String(isApprove) === 'false') {
        // Check claim params
        await proxyFactory.checkClaimParams(
          weiAmount,
          tokenAddress,
          tokenAmount,
          expirationTime,
          linkId,
          linkdropMasterAddress,
          linkdropSignerSignature,
          receiverAddress,
          receiverSignature,
          proxyAddress
        )

        // Claim
        console.log('\n🔦️  Claiming...\n', claimParams)

        tx = await proxyFactory.claim(
          weiAmount,
          tokenAddress,
          tokenAmount,
          expirationTime,
          linkId,
          linkdropMasterAddress,
          linkdropSignerSignature,
          receiverAddress,
          receiverSignature,
          { gasLimit: 500000 }
        )
      } else if (isApprove && String(isApprove === 'true')) {
        // Approve pattern
        // Check claim params
        await proxyFactory.checkClaimParamsApprove(
          weiAmount,
          tokenAddress,
          tokenAmount,
          expirationTime,
          linkId,
          linkdropMasterAddress,
          linkdropSignerSignature,
          receiverAddress,
          receiverSignature,
          proxyAddress
        )

        // Claim
        console.log('\n🔦️  Claiming...\n', claimParams)

        tx = await proxyFactory.claimApprove(
          weiAmount,
          tokenAddress,
          tokenAmount,
          expirationTime,
          linkId,
          linkdropMasterAddress,
          linkdropSignerSignature,
          receiverAddress,
          receiverSignature,
          { gasLimit: 500000 }
        )
      }

      txHash = tx.hash
      console.log(`#️⃣  Tx Hash: ${txHash}`)

      // Save claim tx to database
      const claimTx = new ClaimTx({
        weiAmount,
        tokenAddress,
        tokenAmount,
        expirationTime,
        version,
        chainId,
        linkId,
        linkdropMasterAddress,
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
    version,
    chainId,
    linkId,
    linkdropMasterAddress,
    linkdropSignerSignature,
    receiverAddress,
    receiverSignature,
    isApprove
  } = req.body

  let body = {
    weiAmount,
    nftAddress,
    tokenId,
    expirationTime,
    version,
    chainId,
    linkId,
    linkdropMasterAddress,
    linkdropSignerSignature,
    receiverAddress,
    receiverSignature,
    isApprove
  }

  // Make sure all arguments are passed
  for (let key in body) {
    if (!req.body[key]) {
      const error = `Please provide ${key} argument\n`
      term.red.bold(error)

      return res.json({
        success: false,
        error
      })
    }
  }

  const claimParams = {
    weiAmount,
    nftAddress,
    tokenId,
    expirationTime,
    linkId,
    linkdropMasterAddress,
    linkdropSignerSignature,
    receiverAddress,
    receiverSignature
  }

  if (isApprove) {
    if (String(isApprove) !== 'true' && String(isApprove) !== false) {
      throw newError('Please provide valid isApprove argument')
    }
  }

  const proxyFactory = new ethers.Contract(
    factory,
    LinkdropFactory.abi,
    relayer
  )

  try {
    const initcode = await proxyFactory.getInitcode()

    const proxyAddress = await LinkdropSDK.computeProxyAddress(
      factory,
      linkdropMasterAddress,
      initcode
    )

    // Check whether a claim tx exists in database

    const oldClaimTx = await ClaimTxERC721.findOne({
      weiAmount,
      nftAddress,
      tokenId,
      expirationTime,
      version,
      chainId,
      linkId,
      linkdropMasterAddress,
      receiverAddress
    })

    if (oldClaimTx && oldClaimTx.txHash) {
      return res.json({
        success: true,
        txHash: oldClaimTx.txHash
      })
    }

    try {
      let tx, txHash
      // Top up pattern
      if (!isApprove || String(isApprove) === false) {
        // Check claim params
        await proxyFactory.checkClaimParamsERC721(
          weiAmount,
          nftAddress,
          tokenId,
          expirationTime,
          linkId,
          linkdropMasterAddress,
          linkdropSignerSignature,
          receiverAddress,
          receiverSignature,
          proxyAddress
        )

        // Claim
        console.log('\n🔦️  Claiming...\n', claimParams)

        tx = await proxyFactory.claimERC721(
          weiAmount,
          nftAddress,
          tokenId,
          expirationTime,
          linkId,
          linkdropMasterAddress,
          linkdropSignerSignature,
          receiverAddress,
          receiverSignature,
          { gasLimit: 500000 }
        )
      } else if (isApprove && String(isApprove === 'true')) {
        // Approve pattern
        // Check claim params
        await proxyFactory.checkClaimParamsERC721Approve(
          weiAmount,
          nftAddress,
          tokenId,
          expirationTime,
          linkId,
          linkdropMasterAddress,
          linkdropSignerSignature,
          receiverAddress,
          receiverSignature,
          proxyAddress
        )

        // Claim
        console.log('\n🔦️  Claiming...\n', claimParams)

        tx = await proxyFactory.claimERC721Approve(
          weiAmount,
          nftAddress,
          tokenId,
          expirationTime,
          linkId,
          linkdropMasterAddress,
          linkdropSignerSignature,
          receiverAddress,
          receiverSignature,
          { gasLimit: 500000 }
        )
      }
      txHash = tx.hash
      console.log(`#️⃣  Tx Hash: ${txHash}`)

      // Save claim tx to database
      const claimTxERC721 = new ClaimTxERC721({
        weiAmount,
        nftAddress,
        tokenId,
        expirationTime,
        version,
        chainId,
        linkId,
        linkdropMasterAddress,
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
    return res.json({
      success: false,
      error: err
    })
  }
}
