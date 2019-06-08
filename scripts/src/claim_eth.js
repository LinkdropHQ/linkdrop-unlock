import LinkdropSDK from '../../sdk/src/index'
import ora from 'ora'
import path from 'path'
import { ethers } from 'ethers'
import { terminal as term } from 'terminal-kit'
import { getJsonRpcUrl, getHost, getReceiverAddress, newError } from './utils'
const csvToJson = require('csvtojson')
const queryString = require('query-string')

ethers.errors.setLogLevel('error')

const JSON_RPC_URL = getJsonRpcUrl()
const HOST = getHost()
const RECEIVER_ADDRESS = getReceiverAddress()

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
      text: term.bold.green.str('Claiming ethers...'),
      color: 'green'
    })

    spinner.start()

    await LinkdropSDK.claim({
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

    spinner.succeed('Claimed ethers')
  } catch (err) {
    spinner.fail('Failed to claim ethers')
    throw newError(err)
  }
}

claim()
