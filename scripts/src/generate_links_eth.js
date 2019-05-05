import { generateLinksETH } from './index'
import { getFactoryAddress, getMasterCopyAddress } from './utils'
import LinkdropSDK from '../../sdk/src/index'
const ethers = require('ethers')
const path = require('path')
const configPath = path.resolve(__dirname, '../../config/config.json')
const config = require(configPath)

let { jsonRpcUrl, senderPrivateKey, amount, linksNumber } = config

;(async () => {
  console.log('Generating links...\n')

  const provider = new ethers.providers.JsonRpcProvider(jsonRpcUrl)
  const sender = new ethers.Wallet(senderPrivateKey, provider)

  const factoryAddress = getFactoryAddress()
  const masterCopyAddress = getMasterCopyAddress()

  let proxyAddress = LinkdropSDK.computeProxyAddress(
    factoryAddress,
    sender.address,
    masterCopyAddress
  )

  let cost = amount * linksNumber
  let amountToSend

  const tokenSymbol = 'ETH'
  const tokenDecimals = 18
  const proxyBalance = await provider.getBalance(proxyAddress)
  proxyBalance >= cost
    ? (amountToSend = 0)
    : (amountToSend = cost - proxyBalance)
  const tx = await sender.sendTransaction({
    to: proxyAddress,
    value: amountToSend
  })

  // Get human readable format of amount to send
  amountToSend /= Math.pow(10, tokenDecimals)
  console.log(`⤴️  Sending ${amountToSend} ${tokenSymbol} to ${proxyAddress} `)
  console.log(`#️⃣  Tx Hash: ${tx.hash}`)

  let links = await generateLinksETH()
  return links
})()
