import LinkdropFactory from '../../contracts/build/LinkdropFactory'
import LinkdropSDK from '../../sdk/src/index'
import ClaimTx from '../models/claimTx'
import ClaimTxERC721 from '../models/claimTxERC721'
import { newError } from '../../scripts/src/utils'
import configs from '../../configs'
import { terminal as term } from 'terminal-kit'

import Table from 'cli-table'
const ethers = require('ethers')
ethers.errors.setLogLevel('error')
const config = configs.get('server')

const { jsonRpcUrl, factory, relayerPrivateKey } = config

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
      term.red.bold(error)

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

      term.green.bold(`\nSubmitted claim transaction\n`)
      term.bold(table.toString(), '\n')

      return res.json({
        success: true,
        txHash: oldClaimTx.txHash
      })
    }

    try {
      let tx, txHash

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
          { gasLimit: 500000 }
        )
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
          { gasLimit: 500000 }
        )
      }

      txHash = tx.hash

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

      term.green.bold(`\nSubmitted claim transaction\n`)
      term.bold(table.toString(), '\n')

      res.json({
        success: true,
        txHash: txHash
      })
    } catch (error) {
      term.red.bold(`\n${error.reason ? error.reason : error}\n`)

      return res.json({
        success: false,
        error: error
      })
    }
  } catch (err) {
    term.red.bold(err)
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
      term.red.bold(error)

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

    const table = new Table()

    if (oldClaimTx && oldClaimTx.txHash) {
      table.push(['type', `${weiAmount === '0' ? 'ERC721' : 'ETH + ERC721'}`])
      table.push(['txHash', oldClaimTx.toObject().txHash])

      term.green.bold(`\nSubmitted claim transaction\n`)
      term.bold(table.toString(), '\n')

      return res.json({
        success: true,
        txHash: oldClaimTx.txHash
      })
    }

    try {
      let tx, txHash
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
          { gasLimit: 500000 }
        )
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
          { gasLimit: 500000 }
        )
      }
      txHash = tx.hash

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

      table.push(['type', `${weiAmount === '0' ? 'ERC721' : 'ETH + ERC721'}`])
      for (let key in claimTxERC721.toObject()) {
        if (key !== '_id' && key !== '__v') {
          table.push([key, claimTxERC721.toObject()[key]])
        }
      }

      term.green.bold(`\nSubmitted claim transaction\n`)
      term.bold(table.toString(), '\n')

      res.json({
        success: true,
        txHash: tx.hash
      })
    } catch (error) {
      term.red.bold(`\n${error.reason ? error.reason : error}\n`)

      return res.json({
        success: false,
        error: error
      })
    }
  } catch (err) {
    term.red.bold(err)
  }
}
