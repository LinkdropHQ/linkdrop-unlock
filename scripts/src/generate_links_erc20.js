import { generateLinksERC20 } from './index'
import TokenMock from '../../contracts/build/TokenMock'
import { getFactoryAddress, getMasterCopyAddress } from './utils'
import LinkdropSDK from '../../sdk/src/index'
const ethers = require('ethers')
const path = require('path')
const configPath = path.resolve(__dirname, '../../config/scripts.config.json')
const config = require(configPath)

let {
  jsonRpcUrl,
  linkdropSignerPrivateKey,
  weiAmount,
  tokenAddress,
  tokenAmount,
  linksNumber
} = config

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

  // Send tokens to proxy
  if (tokenAmount > 0 && tokenAddress !== ethers.constants.AddressZero) {
    const cost = tokenAmount * linksNumber
    let amountToSend

    const tokenContract = await new ethers.Contract(
      tokenAddress,
      TokenMock.abi,
      linkdropSigner
    )
    const tokenSymbol = await tokenContract.symbol()
    const tokenDecimals = await tokenContract.decimals()
    const proxyBalance = await tokenContract.balanceOf(proxyAddress)

    if (proxyBalance < cost) {
      amountToSend = cost - proxyBalance
      const tx = await tokenContract.transfer(proxyAddress, amountToSend, {
        gasLimit: 600000
      })

      // Get human readable format of amount to send
      amountToSend /= Math.pow(10, tokenDecimals)
      console.log(
        `⤴️  Sending ${amountToSend} ${tokenSymbol} to ${proxyAddress} `
      )
      console.log(`#️⃣  Tx Hash: ${tx.hash}`)
    }
  }

  // Send eth to proxy
  if (weiAmount > 0) {
    let cost = weiAmount * linksNumber
    let amountToSend

    const tokenSymbol = 'ETH'
    const tokenDecimals = 18
    const proxyBalance = await provider.getBalance(proxyAddress)

    if (proxyBalance < cost) {
      amountToSend = cost - proxyBalance
      const tx = await linkdropSigner.sendTransaction({
        to: proxyAddress,
        value: amountToSend
      })

      // Get human readable format of amount to send
      amountToSend /= Math.pow(10, tokenDecimals)
      console.log(
        `⤴️  Sending ${amountToSend} ${tokenSymbol} to ${proxyAddress} `
      )
      console.log(`#️⃣  Tx Hash: ${tx.hash}`)
    }
  }

  let links = await generateLinksERC20()
  return links
})()
