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
  const csvFilePath = path.resolve(__dirname, '../output/linkdrop_erc721.csv')

  let jsonArray = await csvToJson().fromFile(csvFilePath)
  let rawUrl = jsonArray[i].url
  let parsedUrl = await queryString.extract(rawUrl)
  let parsed = await queryString.parse(parsedUrl)
  return parsed
}

const claimERC721 = async () => {
  const {
    nft,
    tokenId,
    expirationTime,
    linkKey,
    senderAddress,
    senderSignature
  } = await getUrlParams(0)

  await LinkdropSDK.claimERC721(
    jsonRpcUrl,
    host,
    nft,
    tokenId,
    expirationTime,
    linkKey,
    senderAddress,
    senderSignature,
    receiverAddress
  )
}

claimERC721()
