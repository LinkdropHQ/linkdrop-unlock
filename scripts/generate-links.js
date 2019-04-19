import { generateLinks } from './index'
import {
  computeProxyAddress,
  getFactoryAddress,
  getMasterCopyAddress
} from './utils'
require('custom-env').env()
const ethers = require('ethers')

;(async () => {
  console.log(`Current network: ${process.env.NETWORK}`)
  const network = process.env.NETWORK
  const senderPrivateKey = process.env.SENDER_PRIVATE_KEY
  const provider = ethers.getDefaultProvider(network)
  const sender = new ethers.Wallet(senderPrivateKey, provider)

  const factoryAddress = getFactoryAddress()
  const masterCopyAddress = getMasterCopyAddress()

  let proxyAddress = computeProxyAddress(
    factoryAddress,
    sender.address,
    masterCopyAddress
  )

  let links = await generateLinks(proxyAddress)
  return links
})()
