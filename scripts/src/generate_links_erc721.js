import { generateLinksERC721 } from './index'
import NFTMock from '../../contracts/build/NFTMock'
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
  nftAddress,
  nftIds
} = config

;(async () => {
  console.log('Generating links...\n')

  const provider = new ethers.providers.JsonRpcProvider(jsonRpcUrl)
  const linkdropSigner = new ethers.Wallet(linkdropSignerPrivateKey, provider)

  const factoryAddress = getFactoryAddress()
  const masterCopyAddress = getMasterCopyAddress()

  let proxyAddress = LinkdropSDK.computeProxyAddress(
    factoryAddress,
    linkdropSigner.address,
    masterCopyAddress
  )

  const nftContract = await new ethers.Contract(
    nftAddress,
    NFTMock.abi,
    linkdropSigner
  )
  const nftSymbol = await nftContract.symbol()

  // If owner of tokenId is not proxy contract -> send it to proxy
  let tokenIds = JSON.parse(nftIds)

  for (let i = 0; i < tokenIds.length; i++) {
    let owner = await nftContract.ownerOf(tokenIds[i])
    if (
      owner.toString().toLowerCase() !== proxyAddress.toString().toLowerCase()
    ) {
      console.log(
        `⤴️  Sending ${nftSymbol} with tokenId=${
          tokenIds[i]
        } to ${proxyAddress} `
      )
      const tx = await nftContract.transferFrom(
        linkdropSigner.address,
        proxyAddress,
        tokenIds[i],
        { gasLimit: 500000 }
      ) // This should be changed to safeTransferFrom
      console.log(`#️⃣  Tx Hash: ${tx.hash}`)
    }
  }

  // Send eth to proxy
  if (weiAmount > 0) {
    let cost = weiAmount * tokenIds.length
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

  let links = await generateLinksERC721()
  return links
})()
