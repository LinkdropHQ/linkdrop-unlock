import { generateLinksERC20 } from './index'
import TokenMock from '../../contracts/build/TokenMock'
import { getFactoryAddress, getMasterCopyAddress } from './utils'
import LinkdropSDK from '../../sdk/src/index'
const ethers = require('ethers')
const path = require('path')
const configPath = path.resolve(__dirname, '../../config/config.json')
const config = require(configPath)

let { jsonRpcUrl, senderPrivateKey, token, amount, linksNumber } = config

;(async () => {
  console.log('Generating links...\n')

  const provider = new ethers.providers.JsonRpcProvider(jsonRpcUrl)
  const sender = new ethers.Wallet(senderPrivateKey, provider)

  const factoryAddress = getFactoryAddress()
  const masterCopyAddress = getMasterCopyAddress()

  const proxyAddress = LinkdropSDK.computeProxyAddress(
    factoryAddress,
    sender.address,
    masterCopyAddress
  )

  const cost = amount * linksNumber
  let amountToSend

  const tokenContract = await new ethers.Contract(token, TokenMock.abi, sender)
  const tokenSymbol = await tokenContract.symbol()
  const tokenDecimals = await tokenContract.decimals()
  const proxyBalance = await tokenContract.balanceOf(proxyAddress)
  proxyBalance >= cost
    ? (amountToSend = 0)
    : (amountToSend = cost - proxyBalance)
  const tx = await tokenContract.transfer(proxyAddress, amountToSend, {
    gasLimit: 600000
  })

  // Get human readable format of amount to send
  amountToSend /= Math.pow(10, tokenDecimals)
  console.log(`⤴️  Sending ${amountToSend} ${tokenSymbol} to ${proxyAddress} `)
  console.log(`#️⃣  Tx Hash: ${tx.hash}`)

  let links = await generateLinksERC20()
  return links
})()
