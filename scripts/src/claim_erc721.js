const path = require('path')
const configPath = path.resolve(__dirname, '../../config/config.json')
const config = require(configPath)
const csvToJson = require('csvtojson')
const queryString = require('query-string')
const LinkdropSDK = require('../../sdk/src/index')

const { jsonRpcUrl, host, receiverAddress } = config

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
  } = await getUrlParams(1)
  console.log('nft: ', nft)
  console.log('tokenId: ', tokenId)

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
