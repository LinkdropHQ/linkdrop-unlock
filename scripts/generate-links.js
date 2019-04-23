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

let { network, networkId, senderPrivateKey, amount, linksNumber } = config

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

  let proxyBalance = await provider.getBalance(proxyAddress)
  let cost = amount * linksNumber
  let weiToSend = cost - proxyBalance

  let rawTx = { to: proxyAddress, value: weiToSend }

  console.log(`Sending eth to ${proxyAddress}...`)
  let tx = await sender.sendTransaction(rawTx)
  let txHash = tx.hash

  let url
  networkId !== 1
    ? (url = `https://${network}.etherscan.io/tx/${txHash}`)
    : `https://etherscan.io/tx/${txHash}`

  console.log(url)

  let links = await generateLinks(proxyAddress)
  return links
})()
