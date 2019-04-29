import { generateLinks } from './index'
import TokenMock from '../../contracts/build/TokenMock'
import { getFactoryAddress, getMasterCopyAddress } from './utils'
const ethers = require('ethers')
const path = require('path')
const configPath = path.resolve(__dirname, '../../config/config.json')
const config = require(configPath)
const LinkdropSDK = require('../../sdk/src/index')

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

  let proxyAddress = LinkdropSDK.computeProxyAddress(
    factoryAddress,
    sender.address,
    masterCopyAddress
  )

  let cost = amount * linksNumber
  let proxyBalance, amountToSend, tokenSymbol, tokenDecimals, tx

  if (token !== ethers.constants.AddressZero) {
    const tokenContract = await new ethers.Contract(
      token,
      TokenMock.abi,
      sender
    )
    tokenSymbol = await tokenContract.symbol()
    tokenDecimals = await tokenContract.decimals()
    proxyBalance = await tokenContract.balanceOf(proxyAddress)
    proxyBalance >= cost
      ? (amountToSend = 0)
      : (amountToSend = cost - proxyBalance)
    tx = await tokenContract.transfer(proxyAddress, amountToSend, {
      gasLimit: 600000
    })
  } else {
    tokenSymbol = 'ETH'
    tokenDecimals = 18
    proxyBalance = await provider.getBalance(proxyAddress)
    proxyBalance >= cost
      ? (amountToSend = 0)
      : (amountToSend = cost - proxyBalance)
    tx = await sender.sendTransaction({
      to: proxyAddress,
      value: amountToSend
    })
  }

  // Get human readable format of amount to send
  amountToSend /= Math.pow(10, tokenDecimals)
  console.log(`⤴️  Sending ${amountToSend} ${tokenSymbol} to ${proxyAddress} `)
  console.log(`#️⃣  Tx Hash: ${tx.hash}`)

  let links = await generateLinks()
  return links
})()
