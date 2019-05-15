import { generateLinksERC721 } from './index'
import NFTMock from '../../contracts/build/NFTMock'
import { getFactoryAddress, getMasterCopyAddress } from './utils'
import LinkdropSDK from '../../sdk/src/index'
const ethers = require('ethers')
const path = require('path')
const configPath = path.resolve(__dirname, '../../config/scripts.config.json')
const config = require(configPath)

let { jsonRpcUrl, senderPrivateKey, ethAmount, nftAddress, nftIds } = config

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

  const nftContract = await new ethers.Contract(nftAddress, NFTMock.abi, sender)
  const nftSymbol = await nftContract.symbol()

  // If owner of tokenId is not proxy contract -> send it to proxy
  let tokenIds = JSON.parse(nftIds)

  for (let i = 0; i < tokenIds.length; i++) {
    let owner = await nftContract.ownerOf(tokenIds[i])
    if (owner !== proxyAddress) {
      console.log(
        `⤴️  Sending ${nftSymbol} with tokenId=${
          tokenIds[i]
        } to ${proxyAddress} `
      )
      const tx = await nftContract.transferFrom(
        sender.address,
        proxyAddress,
        tokenIds[i],
        { gasLimit: 500000 }
      ) // This should be changed to safeTransferFrom
      console.log(`#️⃣  Tx Hash: ${tx.hash}`)
    }
  }

  // Send eth to proxy
  if (ethAmount > 0) {
    let cost = ethAmount * tokenIds.length
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
    console.log(
      `⤴️  Sending ${amountToSend} ${tokenSymbol} to ${proxyAddress} `
    )
    console.log(`#️⃣  Tx Hash: ${tx.hash}`)
  }

  let links = await generateLinksERC721()
  return links
})()
