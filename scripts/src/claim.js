const path = require('path')
const configPath = path.resolve(__dirname, '../../config/config.json')
const config = require(configPath)
const csvToJson = require('csvtojson')
const queryString = require('query-string')
const LinkdropSDK = require('../../sdk/src/index')

const { jsonRpcUrl, host, receiverAddress } = config

// Get params from generated link [output/linkdrop_eth.csv]
const getUrlParams = async i => {
  const csvFilePath = path.resolve(__dirname, '../output/linkdrop_eth.csv')
  let jsonArray = await csvToJson().fromFile(csvFilePath)
  let rawUrl = jsonArray[i].url
  let parsedUrl = await queryString.extract(rawUrl)
  let parsed = await queryString.parse(parsedUrl)
  return parsed
}

const claim = async () => {
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

claim()
