import { generateLinksERC721 } from './index'
import NFTMock from '../../contracts/build/NFTMock'
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
  nftAddress,
  nftIds,
  isApprove
} = config

if (
  isApprove === null ||
  (String(isApprove) !== 'true' && String(isApprove) !== 'false')
) {
  throw new Error('Please provide valid isApprove argument')
}

;(async () => {
  console.log('Generating links...\n')

  const provider = new ethers.providers.JsonRpcProvider(jsonRpcUrl)
  const linkdropMaster = new ethers.Wallet(linkdropMasterPrivateKey, provider)

  const factoryAddress = getFactoryAddress()
  const initcode = getInitcode()

  let proxyAddress = LinkdropSDK.computeProxyAddress(
    factoryAddress,
    linkdropMaster.address,
    initcode
  )

  const nftContract = await new ethers.Contract(
    nftAddress,
    NFTMock.abi,
    linkdropMaster
  )
  const nftSymbol = await nftContract.symbol()

  // If owner of tokenId is not proxy contract -> send it to proxy
  let tokenIds = JSON.parse(nftIds)
  let tx
  try {
    // Top up
    if (String(isApprove) === 'false') {
      for (let i = 0; i < tokenIds.length; i++) {
        let owner = await nftContract.ownerOf(tokenIds[i])
        if (
          owner.toString().toLowerCase() !==
          proxyAddress.toString().toLowerCase()
        ) {
          console.log(
            `⤴️  Transfering ${nftSymbol} with tokenId=${
              tokenIds[i]
            } to ${proxyAddress} `
          )

          tx = await nftContract.transferFrom(
            linkdropMaster.address,
            proxyAddress,
            tokenIds[i],
            { gasLimit: 500000 }
          )
          console.log(`#️⃣  Tx Hash: ${tx.hash}`)
        }
      }
    } else if (String(isApprove) === 'true') {
      // Approve
      let isApprovedForAll = await nftContract.isApprovedForAll(
        linkdropMaster.address,
        proxyAddress
      )
      if (!isApprovedForAll) {
        console.log(`⤴️  Approving all tokens to ${proxyAddress} `)
        tx = await nftContract.setApprovalForAll(proxyAddress, true, {
          gasLimit: 500000
        })
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
        tx = await linkdropMaster.sendTransaction({
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
  } catch (err) {
    console.error(err)
  }

  let links = await generateLinksERC721()
  return links
})()
