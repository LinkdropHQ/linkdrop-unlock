import { generateLinksERC721 } from './index'
import NFTMock from '../../contracts/build/NFTMock'
import { getFactoryAddress, getMasterCopyAddress } from './utils'
const ethers = require('ethers')
const path = require('path')
const configPath = path.resolve(__dirname, '../../config/config.json')
const config = require(configPath)
const LinkdropSDK = require('../../sdk/src/index')

let { jsonRpcUrl, senderPrivateKey, nft, nftIds } = config

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

  const nftContract = await new ethers.Contract(nft, NFTMock.abi, sender)
  const nftSymbol = await nftContract.symbol()

  // If owner of tokenId is not proxy contract -> send it to proxy
  let tokenIds = JSON.parse(nftIds)

  for (let i = 0; i < tokenIds.length; i++) {
    let owner = await nftContract.ownerOf(i)
    if (owner === proxyAddress) {
      console.log(
        `⤴️  Sending ${nftSymbol} with tokenId=${i} to ${proxyAddress} `
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

  let links = await generateLinksERC721()
  return links
})()
