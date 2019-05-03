import LinkdropSDK from '../../sdk/src/index'
const path = require('path')
const configPath = path.resolve(__dirname, '../../config/config.json')
const config = require(configPath)
const csvToJson = require('csvtojson')
const queryString = require('query-string')

const { jsonRpcUrl, host, receiverAddress } = config

if (jsonRpcUrl == null || jsonRpcUrl === '') {
  throw 'Please provide JSON RPC url'
}

if (host == null || host === '') {
  throw 'Please provide host'
}

if (receiverAddress == null || receiverAddress === '') {
  throw 'Please provide receiver address'
}

// Get params from generated link [output/linkdrop_eth.csv]
const getUrlParams = async i => {
  const csvFilePath = path.resolve(__dirname, '../output/linkdrop_eth.csv')
  const jsonArray = await csvToJson().fromFile(csvFilePath)
  const rawUrl = jsonArray[i].url
  const parsedUrl = await queryString.extract(rawUrl)
  const parsed = await queryString.parse(parsedUrl)
  return parsed
}

const claimETH = async () => {
  const {
    token,
    amount,
    expirationTime,
    linkKey,
    senderAddress,
    senderSignature
  } = await getUrlParams(0)

  await LinkdropSDK.claim(
    jsonRpcUrl,
    host,
    token,
    amount,
    expirationTime,
    linkKey,
    senderAddress,
    senderSignature,
    receiverAddress
  )
}

claimETH()
