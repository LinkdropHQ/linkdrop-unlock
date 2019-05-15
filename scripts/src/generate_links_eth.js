import { generateLinksETH } from './index'
import { getFactoryAddress, getMasterCopyAddress } from './utils'
import LinkdropSDK from '../../sdk/src/index'
const ethers = require('ethers')
const path = require('path')
const configPath = path.resolve(__dirname, '../../config/scripts.config.json')
const config = require(configPath)

let { jsonRpcUrl, linkdropSignerPrivateKey, weiAmount, linksNumber } = config

;(async () => {
  console.log('Generating links...\n')

  const provider = new ethers.providers.JsonRpcProvider(jsonRpcUrl)
  const linkdropSigner = new ethers.Wallet(linkdropSignerPrivateKey, provider)

  const factoryAddress = getFactoryAddress()
  const masterCopyAddress = getMasterCopyAddress()

  const proxyAddress = LinkdropSDK.computeProxyAddress(
    factoryAddress,
    linkdropSigner.address,
    masterCopyAddress
  )

  // Send eth to proxy

  let cost = weiAmount * linksNumber
  let amountToSend

  const tokenSymbol = 'ETH'
  const tokenDecimals = 18
  const proxyBalance = await provider.getBalance(proxyAddress)
  proxyBalance >= cost
    ? (amountToSend = 0)
    : (amountToSend = cost - proxyBalance)
  const tx = await linkdropSigner.sendTransaction({
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
