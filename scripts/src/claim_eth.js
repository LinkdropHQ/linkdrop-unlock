import LinkdropSDK from '../../sdk/src/index'

import ora from 'ora'
import path from 'path'
import { ethers } from 'ethers'
import { terminal as term } from 'terminal-kit'
import { newError, getString } from './utils'

const csvToJson = require('csvtojson')
const queryString = require('query-string')

ethers.errors.setLogLevel('error')

const JSON_RPC_URL = getString('jsonRpcUrl')
const HOST = getString('host')
const RECEIVER_ADDRESS = getString('receiverAddress')

// Get linkdrop parameters
const getUrlParams = async i => {
  const csvFilePath = path.resolve(__dirname, '../output/linkdrop_eth.csv')
  const jsonArray = await csvToJson().fromFile(csvFilePath)
  const rawUrl = jsonArray[i].url
  const parsedUrl = await queryString.extract(rawUrl)
  const parsed = await queryString.parse(parsedUrl)
  return parsed
}

const claim = async () => {
  let spinner
  const {
    weiAmount,
    tokenAddress,
    tokenAmount,
    expirationTime,
    version,
    chainId,
    linkKey,
    linkdropMasterAddress,
    linkdropSignerSignature,
    isApprove
  } = await getUrlParams(0)
  try {
    spinner = ora({
      text: term.bold.green.str('Claiming\n'),
      color: 'green'
    })

    spinner.start()

    const { error, success, txHash } = await LinkdropSDK.claim({
      jsonRpcUrl: JSON_RPC_URL,
      host: HOST,
      weiAmount,
      tokenAddress,
      tokenAmount,
      expirationTime,
      version,
      chainId,
      linkKey,
      linkdropMasterAddress,
      linkdropSignerSignature,
      receiverAddress: RECEIVER_ADDRESS,
      isApprove
    })

    if (success === true && txHash) {
      spinner.succeed(term.bold.str('Submitted claim transaction'))
      term.bold(`Tx hash: ^g${txHash}\n`)
    } else {
      throw newError(`${error.reason ? error.reason : error}`)
    }
  } catch (err) {
    spinner.fail(term.bold.red.str('Failed to claim'))
    throw newError(err)
  }
}

claim()
