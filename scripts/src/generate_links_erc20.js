import { generateLinksERC20 } from './index'
import TokenMock from '../../contracts/build/TokenMock'
import { getFactoryAddress, getInitcode } from './utils'
import LinkdropSDK from '../../sdk/src/index'
const ethers = require('ethers')
const path = require('path')
const configPath = path.resolve(__dirname, '../../config/scripts.config.json')
const config = require(configPath)

let {
  jsonRpcUrl,
  linkdropMasterPrivateKey,
  weiAmount,
  tokenAddress,
  tokenAmount,
  linksNumber,
  isApprove
} = config

if (
  isApprove === null ||
  (String(isApprove) !== 'true' && String(isApprove) !== 'false')
) {
  throw new Error('Please provide valid isApprove argument')
}

(async () => {
  console.log('Generating links...\n')

  const provider = new ethers.providers.JsonRpcProvider(jsonRpcUrl)
  const linkdropMaster = new ethers.Wallet(linkdropMasterPrivateKey, provider)

  const factoryAddress = getFactoryAddress()
  const initcode = getInitcode()

  const proxyAddress = LinkdropSDK.computeProxyAddress(
    factoryAddress,
    linkdropMaster.address,
    initcode
  )

  // Send tokens to proxy
  if (tokenAmount > 0 && tokenAddress !== ethers.constants.AddressZero) {
    const cost = tokenAmount * linksNumber
    let amount

    const tokenContract = await new ethers.Contract(
      tokenAddress,
      TokenMock.abi,
      linkdropMaster
    )
    const tokenSymbol = await tokenContract.symbol()
    const tokenDecimals = await tokenContract.decimals()
    const proxyBalance = await tokenContract.balanceOf(proxyAddress)

    try {
      if (proxyBalance < cost) {
        amount = cost - proxyBalance

        let tx

        if (String(isApprove) === 'false') {
          // Top up
          tx = await tokenContract.transfer(proxyAddress, amount, {
            gasLimit: 600000
          })

          // Get human readable format of amount to send
          amount /= Math.pow(10, tokenDecimals)
          console.log(
            `⤴️  Transfering ${amount} ${tokenSymbol} to ${proxyAddress} `
          )
        } else if (String(isApprove) === 'true') {
          // Approve
          tx = await tokenContract.approve(proxyAddress, amount, {
            gasLimit: 600000
          })

          // Get human readable format of amount to approve
          amount /= Math.pow(10, tokenDecimals)
          console.log(
            `⤴️  Approving ${amount} ${tokenSymbol} to ${proxyAddress} `
          )
          console.log(`#️⃣  Tx Hash: ${tx.hash}`)
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
            const tx = await linkdropMaster.sendTransaction({
              to: proxyAddress,
              value: amountToSend
            })

            // Get human readable format of amount to send
            amountToSend /= Math.pow(10, tokenDecimals)
            console.log(
              `⤴️  Transfering ${amountToSend} ${tokenSymbol} to ${proxyAddress} `
            )
            console.log(`#️⃣  Tx Hash: ${tx.hash}`)
          }
        }
      }
    } catch (err) {
      console.error(err)
    }
  }

  let links = await generateLinksERC20()
  return links
})()
