import { generateLinks } from './index'
import {
  computeProxyAddress,
  getFactoryAddress,
  getMasterCopyAddress
} from './utils'

const ethers = require('ethers')
const path = require('path')
const configPath = path.resolve(__dirname, '../config/config.json')
const config = require(configPath)

let { network, senderPrivateKey } = config

;(async () => {
  console.log('Generating links...\n')

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
