import { signReceiverAddress } from './utils'
const ethers = require('ethers')
const path = require('path')
const configPath = path.resolve(__dirname, '../../config/scripts.config.json')
const config = require(configPath)
const csvToJson = require('csvtojson')
const queryString = require('query-string')
const axios = require('axios')

let { jsonRpcUrl, host, receiverAddress } = config

const provider = new ethers.providers.JsonRpcProvider(jsonRpcUrl)

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

  // Get receiver signature
  const receiverSignature = await signReceiverAddress(linkKey, receiverAddress)

  // Get linkId from linkKey
  const linkId = new ethers.Wallet(linkKey, provider).address

  const claimParams = {
    token,
    amount,
    expirationTime,
    linkId,
    senderAddress,
    senderSignature,
    receiverAddress,
    receiverSignature
  }
  try {
    const response = await axios.post(
      `${host}/api/v1/linkdrops/claim`,
      claimParams
    )
    if (response.status !== 200) {
      console.error(`\n❌ Invalid response status ${response.status}`)
    } else {
      console.log('\n✅ Successfully claimed tokens')

      let txHash = response.data.txHash
      console.log(`#️⃣  Tx Hash: ${txHash}`)
    }
  } catch (err) {
    console.error(err)
  }
}

claim()
