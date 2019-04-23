import { generateLinks } from './index'
import IERC20 from '../../build/IERC20'
import {
  computeProxyAddress,
  getFactoryAddress,
  getMasterCopyAddress
} from './utils'

const ethers = require('ethers')
const path = require('path')
const configPath = path.resolve(__dirname, '../../config/scripts.config.json')
const config = require(configPath)

let { jsonRpcUrl, senderPrivateKey, token, amount, linksNumber } = config

config.token == null || config.token === ''
  ? (token = '0x0000000000000000000000000000000000000000')
  : (token = config.token)
;(async () => {
  console.log('Generating links...\n')

  const provider = new ethers.providers.JsonRpcProvider(jsonRpcUrl)
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

  let amountToSend
  proxyBalance >= cost
    ? (amountToSend = 0)
    : (amountToSend = cost - proxyBalance)

  let rawTx = { to: proxyAddress, value: amountToSend }

  let tokenSymbol, tokenDecimals

  if (token !== ethers.constants.AddressZero) {
    const tokenContract = await new ethers.Contract(token, IERC20, provider)
    tokenSymbol = await tokenContract.symbol()
    tokenDecimals = await tokenContract.decimals()
  } else {
    tokenSymbol = 'ETH'
    tokenDecimals = 18
  }
  amountToSend /= Math.pow(10, tokenDecimals)

  console.log(`⤴️  Sending ${amountToSend} ${tokenSymbol} to ${proxyAddress} `)

  let tx = await sender.sendTransaction(rawTx)
  console.log(`#️⃣  Tx Hash: ${tx.hash}`)

  let links = await generateLinks(proxyAddress)
  return links
})()
