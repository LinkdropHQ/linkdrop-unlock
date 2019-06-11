import LinkdropFactory from '../../contracts/build/LinkdropFactory'
import LinkdropSDK from '../../sdk/src/index'
import ClaimTx from '../models/claimTx'
import ClaimTxERC721 from '../models/claimTxERC721'
import { newError } from '../../scripts/src/utils'
import configs from '../../configs'
import ora from 'ora'
import { terminal as term } from 'terminal-kit'
const ethers = require('ethers')
ethers.errors.setLogLevel('error')

const config = configs.get('server')

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
    tokenAddress,
    tokenAmount,
    expirationTime,
    linkId,
    linkdropMasterAddress,
    linkdropSignerSignature,
    receiverAddress,
    receiverSignature
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
    let spinner = ora({
      text: term.bold.green.str('Claiming'),
      color: 'green'
    })

    spinner.start()

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
      spinner.info(
        term.bold.str(
          `Submitted claim transaction: \n\n${JSON.stringify(
            claimParams,
            null,
            1
          )}\n`
        )
      )
      spinner.succeed(term.bold.str(`Tx hash: ^g${oldClaimTx.txHash}\n`))

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

      spinner.info(
        term.bold.str(
          `Submitted claim transaction: \n\n${JSON.stringify(
            claimParams,
            null,
            1
          )}\n`
        )
      )
      spinner.succeed(term.bold.str(`Tx hash: ^g${txHash}\n`))

      res.json({
        success: true,
        txHash: txHash
      })
    } catch (error) {
      spinner.fail(term.bold.red.str(`${error.reason ? error.reason : error}`))

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
    let spinner = ora({
      text: term.bold.green.str('Claiming'),
      color: 'green'
    })

    spinner.start()

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
      spinner.info(
        term.bold.str(
          `Submitted claim transaction: \n\n${JSON.stringify(
            claimParams,
            null,
            1
          )}\n`
        )
      )
      spinner.succeed(term.bold.str(`Tx hash: ^g${oldClaimTx.txHash}\n`))

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

      spinner.info(
        term.bold.str(
          `Submitted claim transaction: \n\n${JSON.stringify(
            claimParams,
            null,
            1
          )}\n`
        )
      )
      spinner.succeed(term.bold.str(`Tx hash: ^g${oldClaimTx.txHash}\n`))

      res.json({
        success: true,
        txHash: tx.hash
      })
    } catch (error) {
      spinner.fail(term.bold.red.str(`${error.reason ? error.reason : error}`))

      return res.json({
        success: false,
        error: error
      })
    }
  } catch (err) {
    console.error(err)
  }
}
