import LinkdropSDK from '../../sdk/src/index'
const path = require('path')
const configPath = path.resolve(__dirname, '../../config/scripts.config.json')
const config = require(configPath)
const csvToJson = require('csvtojson')
const queryString = require('query-string')

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
    weiAmount,
    nftAddress,
    tokenId,
    expirationTime,
    version,
    chainId,
    linkKey,
    linkdropMasterAddress,
    linkdropSignerSignature,
    isApprove
  } = await getUrlParams(0)

  await LinkdropSDK.claimERC721({
    jsonRpcUrl,
    host,
    weiAmount,
    nftAddress,
    tokenId,
    expirationTime,
    version,
    chainId,
    linkKey,
    linkdropMasterAddress,
    linkdropSignerSignature,
    receiverAddress,
    isApprove
  })
}

claimERC721()
