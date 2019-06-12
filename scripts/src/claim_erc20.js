import LinkdropSDK from '../../sdk/src/index'
const path = require('path')
const configPath = path.resolve(__dirname, '../../config/scripts.config.json')
const config = require(configPath)
const csvToJson = require('csvtojson')
const queryString = require('query-string')

const { jsonRpcUrl, host, receiverAddress } = config

// Get params from generated link [output/linkdrop_erc20.csv]
const getUrlParams = async i => {
  const csvFilePath = path.resolve(__dirname, '../output/linkdrop_erc20.csv')
  const jsonArray = await csvToJson().fromFile(csvFilePath)
  const rawUrl = jsonArray[i].url
  const parsedUrl = await queryString.extract(rawUrl)
  const parsed = await queryString.parse(parsedUrl)
  return parsed
}

const claimERC20 = async () => {
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

  await LinkdropSDK.claim({
    jsonRpcUrl,
    host,
    weiAmount,
    tokenAddress,
    tokenAmount,
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

claimERC20()
