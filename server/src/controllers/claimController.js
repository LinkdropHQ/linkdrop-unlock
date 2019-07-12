import LinkdropFactory from '../../../contracts/build/LinkdropFactory'
import LinkdropSDK from '../../../sdk/src/index'
import ClaimTx from '../models/claimTx'
import ClaimTxERC721 from '../models/claimTxERC721'
import { newError } from '../../../scripts/src/utils'
import configs from '../../../configs'
import logger from '../utils/logger'

import Table from 'cli-table'
const ethers = require('ethers')
ethers.errors.setLogLevel('error')
const config = configs.get('server')

const { jsonRpcUrl, factory, relayerPrivateKey } = config

const ONE_GWEI = ethers.utils.parseUnits('1', 'gwei')

if (jsonRpcUrl == null || jsonRpcUrl === '') {
  throw newError('Please provide json rpc url')
}

if (factory == null || factory === '') {
  throw newError('Please provide proxy factory address')
}

if (relayerPrivateKey == null || relayerPrivateKey === '') {
  throw newError('Please provide relayer private key')
}

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

  let body = {
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
    receiverSignature
  }

  // Make sure all arguments are passed
  for (let key in body) {
    if (!req.body[key]) {
      const error = `Please provide ${key} argument\n`
      logger.error(error)

      return res.json({
        success: false,
        error
      })
    }
  }

  if (isApprove != null) {
    if (isApprove !== 'true' && isApprove !== 'false') {
      throw newError('Please provide valid isApprove argument')
    }
  }

  const proxyFactory = new ethers.Contract(
    factory,
    LinkdropFactory.abi,
    relayer
  )

  const initcode = await proxyFactory.getInitcode()

  const proxyAddress = await LinkdropSDK.computeProxyAddress(
    factory,
    linkdropMasterAddress,
    initcode
  )

  // Save hash of claim params
  const paramsHash = ethers.utils.solidityKeccak256(
    [
      'uint256',
      'address',
      'uint256',
      'uint256',
      'address',
      'address',
      'bytes',
      'address',
      'bytes',
      'address'
    ],
    [
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
    ]
  )

  // Check whether a claim tx exists in database
  const oldClaimTx = await ClaimTx.findOne({
    paramsHash
  })
  const table = new Table()
  let type

  if (oldClaimTx && oldClaimTx.txHash) {
    if (tokenAddress === ethers.constants.AddressZero) type = 'ETH'
    else {
      if (weiAmount === '0') type = 'ERC20'
      else type = 'ETH + ERC20'
    }
    table.push(['type', type])

    table.push(['txHash', oldClaimTx.toObject().txHash])

    logger.info(`\nSubmitted claim transaction\n`)
    logger.info(table.toString(), '\n')

    return res.json({
      success: true,
      txHash: oldClaimTx.txHash
    })
  }

  try {
    let tx
    // let gasPrice = await provider.getGasPrice()
    let gasPrice = ethers.utils.parseUnits('0.005', 'gwei')

    // Top up pattern
    if (isApprove == null || isApprove === 'false') {
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
        { gasLimit: 500000, gasPrice: gasPrice }
      )
      const interval = setInterval(async () => {
        if (tx.hash != null) {
          if ((await provider.getTransactionReceipt(tx.hash)) != null) {
            return clearInterval(interval)
          } else {
            gasPrice = gasPrice.add(ONE_GWEI)

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
              { gasLimit: 500000, gasPrice: gasPrice, nonce: tx.nonce }
            )

            const claimTx = await ClaimTx.findOne({
              paramsHash
            })

            claimTx.txHash = tx.hash
            await claimTx.save()
          }
        }
      }, 60 * 1000)
    } else if (isApprove === 'true') {
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
        { gasLimit: 500000, gasPrice: gasPrice }
      )

      const interval = setInterval(async () => {
        if (tx.hash != null) {
          const txReceipt = await provider.getTransactionReceipt(tx.hash)
          if (txReceipt != null) {
            console.log({ txReceipt })
            console.log('Clearing interval..')
            return clearInterval(interval)
          } else {
            console.log('Increasing gas price...')
            gasPrice = gasPrice.add(ONE_GWEI)

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
              { gasLimit: 500000, gasPrice: gasPrice, nonce: tx.nonce }
            )

            const claimTx = await ClaimTx.findOne({
              paramsHash
            })

            claimTx.txHash = tx.hash
            await claimTx.save()
          }
        }
      }, 60 * 1000)
    }

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
      paramsHash,
      txHash: tx.hash
    })

    await claimTx.save()

    if (tokenAddress === ethers.constants.AddressZero) type = 'ETH'
    else {
      if (weiAmount === '0') type = 'ERC20'
      else type = 'ETH + ERC20'
    }
    table.push(['type', type])

    for (let key in claimTx.toObject()) {
      if (key !== '_id' && key !== '__v') {
        table.push([key, claimTx.toObject()[key]])
      }
    }

    logger.info(`\nSubmitted claim transaction\n`)
    logger.info(table.toString(), '\n')

    res.json({
      success: true,
      txHash: tx.hash
    })
  } catch (error) {
    logger.info(`\n${error.reason ? error.reason : error}\n`)

    return res.json({
      success: false,
      error: error
    })
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
    receiverSignature
  }

  // Make sure all arguments are passed
  for (let key in body) {
    if (!req.body[key]) {
      const error = `Please provide ${key} argument\n`
      logger.error(error)

      return res.json({
        success: false,
        error
      })
    }
  }

  if (isApprove != null) {
    if (isApprove !== 'true' && isApprove !== 'false') {
      throw newError('Please provide valid isApprove argument')
    }
  }

  const proxyFactory = new ethers.Contract(
    factory,
    LinkdropFactory.abi,
    relayer
  )

  const initcode = await proxyFactory.getInitcode()

  const proxyAddress = await LinkdropSDK.computeProxyAddress(
    factory,
    linkdropMasterAddress,
    initcode
  )

  // Save hash of claim params
  const paramsHash = ethers.utils.solidityKeccak256(
    [
      'uint256',
      'address',
      'uint256',
      'uint256',
      'address',
      'address',
      'bytes',
      'address',
      'bytes',
      'address'
    ],
    [
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
    ]
  )

  // Check whether a claim tx exists in database
  const oldClaimTx = await ClaimTxERC721.findOne({
    paramsHash
  })

  const table = new Table()

  if (oldClaimTx && oldClaimTx.txHash) {
    table.push(['type', `${weiAmount === '0' ? 'ERC721' : 'ETH + ERC721'}`])
    table.push(['txHash', oldClaimTx.toObject().txHash])

    logger.info(`\nSubmitted claim transaction\n`)
    logger.info(table.toString(), '\n')

    return res.json({
      success: true,
      txHash: oldClaimTx.txHash
    })
  }

  try {
    let tx
    let gasPrice = await provider.getGasPrice()

    // Top up pattern
    if (isApprove == null || isApprove === 'false') {
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
        { gasLimit: 500000, gasPrice: gasPrice }
      )
      const interval = setInterval(async () => {
        if (tx.hash != null) {
          if ((await provider.getTransactionReceipt(tx.hash)) != null) {
            return clearInterval(interval)
          } else {
            gasPrice = gasPrice.add(ONE_GWEI)

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
              { gasLimit: 500000, gasPrice: gasPrice, nonce: tx.nonce }
            )

            const claimTxERC721 = await ClaimTxERC721.findOne({
              paramsHash
            })

            claimTxERC721.txHash = tx.hash
            await claimTxERC721.save()
          }
        }
      }, 60 * 1000)
    } else if (isApprove === 'true') {
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
        { gasLimit: 500000, gasPrice: gasPrice }
      )

      const interval = setInterval(async () => {
        if (tx.hash != null) {
          if ((await provider.getTransactionReceipt(tx.hash)) != null) {
            return clearInterval(interval)
          } else {
            gasPrice = gasPrice.add(ONE_GWEI)

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
              { gasLimit: 500000, gasPrice: gasPrice, nonce: tx.nonce }
            )

            const claimTxERC721 = await ClaimTxERC721.findOne({
              paramsHash
            })

            claimTxERC721.txHash = tx.hash
            await claimTxERC721.save()
          }
        }
      }, 60 * 1000)
    }

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
      paramsHash,
      txHash: tx.hash
    })

    await claimTxERC721.save()

    table.push(['type', `${weiAmount === '0' ? 'ERC721' : 'ETH + ERC721'}`])
    for (let key in claimTxERC721.toObject()) {
      if (key !== '_id' && key !== '__v') {
        table.push([key, claimTxERC721.toObject()[key]])
      }
    }

    logger.info(`\nSubmitted claim transaction\n`)
    logger.info(table.toString(), '\n')

    res.json({
      success: true,
      txHash: tx.hash
    })
  } catch (error) {
    logger.error(`\n${error.reason ? error.reason : error}\n`)

    return res.json({
      success: false,
      error: error
    })
  }
}
