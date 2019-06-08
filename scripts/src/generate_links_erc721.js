import NFTMock from '../../contracts/build/NFTMock'
import LinkdropSDK from '../../sdk/src/index'
import ora from 'ora'
import { terminal as term } from 'terminal-kit'
import { ethers } from 'ethers'
import path from 'path'
import fastcsv from 'fast-csv'
import fs from 'fs'
import {
  newError,
  getJsonRpcUrl,
  getHost,
  getLinkdropMasterPrivateKey,
  getLinkdropMasterWallet,
  getFactoryAddress,
  getWeiAmount,
  getLinksNumber,
  getMasterCopyVersion,
  getInitCode,
  getChainId,
  getExpirationTime,
  getIsApprove,
  getProvider,
  getNftAddress,
  getNftIds
} from './utils'

ethers.errors.setLogLevel('error')

const JSON_RPC_URL = getJsonRpcUrl()
const HOST = getHost()
const LINKDROP_MASTER_PRIVATE_KEY = getLinkdropMasterPrivateKey()
const LINKDROP_MASTER_WALLET = getLinkdropMasterWallet()
const LINKDROP_FACTORY_ADDRESS = getFactoryAddress()
const WEI_AMOUNT = getWeiAmount()
const LINKS_NUMBER = getLinksNumber()
const LINKDROP_MASTER_COPY_VERSION = getMasterCopyVersion()
const INIT_CODE = getInitCode()
const CHAIN_ID = getChainId()
const EXPIRATION_TIME = getExpirationTime()
const IS_APPROVE = getIsApprove()
const PROVIDER = getProvider()
const NFT_ADDRESS = getNftAddress()
const NFT_IDS = getNftIds()

export const generate = async () => {
  let spinner, tx
  try {
    spinner = ora({
      text: term.bold.green.str('Generating links'),
      color: 'green'
    })
    spinner.start()

    const proxyAddress = LinkdropSDK.computeProxyAddress(
      LINKDROP_FACTORY_ADDRESS,
      LINKDROP_MASTER_WALLET.address,
      INIT_CODE
    )

    const nftContract = await new ethers.Contract(
      NFT_ADDRESS,
      NFTMock.abi,
      LINKDROP_MASTER_WALLET
    )
    const nftSymbol = await nftContract.symbol()

    // If owner of tokenId is not proxy contract -> send it to proxy
    let tokenIds = JSON.parse(NFT_IDS)

    if (String(IS_APPROVE) === 'false') {
      // Transfer tokens
      for (let i = 0; i < tokenIds.length; i++) {
        let owner = await nftContract.ownerOf(tokenIds[i])
        if (
          owner.toString().toLowerCase() !==
          proxyAddress.toString().toLowerCase()
        ) {
          spinner.info(
            term.bold.str(
              `Transfering ${nftSymbol} with tokenId=${
                tokenIds[i]
              } to ^g${proxyAddress} `
            )
          )

          tx = await nftContract.transferFrom(
            LINKDROP_MASTER_WALLET.address,
            proxyAddress,
            tokenIds[i],
            { gasLimit: 1000000 }
          )
          term.bold(`Tx Hash: ^g${tx.hash}\n`)
        }
      }
    } else if (String(IS_APPROVE) === 'true') {
      // Approve tokens
      let isApprovedForAll = await nftContract.isApprovedForAll(
        LINKDROP_MASTER_WALLET.address,
        proxyAddress
      )
      if (!isApprovedForAll) {
        spinner.info(term.bold.str(`Approving all tokens to ^g${proxyAddress}`))

        tx = await nftContract.setApprovalForAll(proxyAddress, true, {
          gasLimit: 500000
        })
        term.bold(`Tx Hash: ^g${tx.hash}\n`)
      }
    }

    if (WEI_AMOUNT > 0) {
      // Transfer ethers
      let cost = WEI_AMOUNT * LINKS_NUMBER
      let amountToSend

      const tokenSymbol = 'ETH'
      const tokenDecimals = 18
      const proxyBalance = await PROVIDER.getBalance(proxyAddress)

      if (proxyBalance < cost) {
        amountToSend = cost - proxyBalance

        spinner.info(
          term.bold.str(
            `Sending ${amountToSend /
              Math.pow(10, tokenDecimals)} ${tokenSymbol} to ^g${proxyAddress}`
          )
        )

        tx = await LINKDROP_MASTER_WALLET.sendTransaction({
          to: proxyAddress,
          value: amountToSend
        })

        term.bold(`Tx Hash: ^g${tx.hash}\n`)
      }
    }

    // Generate links
    let links = []

    for (let i = 0; i < tokenIds.length; i++) {
      let {
        url,
        linkId,
        linkKey,
        linkdropSignerSignature
      } = await LinkdropSDK.generateLinkERC721({
        jsonRpcUrl: JSON_RPC_URL,
        chainId: CHAIN_ID,
        host: HOST,
        linkdropMasterPrivateKey: LINKDROP_MASTER_PRIVATE_KEY,
        weiAmount: WEI_AMOUNT,
        nftAddress: NFT_ADDRESS,
        tokenId: tokenIds[i],
        expirationTime: EXPIRATION_TIME,
        version: LINKDROP_MASTER_COPY_VERSION,
        isApprove: IS_APPROVE
      })

      let link = { i, linkId, linkKey, linkdropSignerSignature, url }
      links.push(link)
    }

    // Save links
    const dir = path.join(__dirname, '../output')
    const filename = path.join(dir, 'linkdrop_erc721.csv')

    try {
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir)
      }
      const ws = fs.createWriteStream(filename)
      fastcsv.write(links, { headers: true }).pipe(ws)
    } catch (err) {
      throw newError(err)
    }

    spinner.succeed(term.bold.str(`Generated and saved links to ^_${filename}`))

    return links
  } catch (err) {
    spinner.fail(term.bold.red.str('Failed to generate links'))
    throw newError(err)
  }
}

generate()
