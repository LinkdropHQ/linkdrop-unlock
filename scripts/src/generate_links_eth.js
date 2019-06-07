import {
  getFactoryAddress,
  getInitcode,
  getLinkdropMasterWallet,
  getProvider,
  getChainId,
  getLinksNumber,
  getIsApprove,
  newError
} from './utils'
import LinkdropSDK from '../../sdk/src/index'

import ora from 'ora'
import { terminal as term } from 'terminal-kit'
import { ethers } from 'ethers'
import path from 'path'
import fastcsv from 'fast-csv'
import fs from 'fs'

import configs from '../../configs'

const config = configs.get('scripts')

let {
  chainId,
  linkdropMasterPrivateKey,
  weiAmount,
  tokenAddress,
  tokenAmount,
  linksNumber,
  jsonRpcUrl,
  host,
  nftAddress,
  nftIds,
  isApprove,
  version
} = config

;(async () => {
  let spinner
  try {
    spinner = ora({
      text: term.green.str('Generating links'),
      color: 'green'
    })

    spinner.start()

    const provider = getProvider()
    const linkdropMaster = getLinkdropMasterWallet()
    const factoryAddress = getFactoryAddress()
    const initcode = getInitcode()

    const proxyAddress = LinkdropSDK.computeProxyAddress(
      factoryAddress,
      linkdropMaster.address,
      initcode
    )

    // Send eth to proxy
    let cost = weiAmount * linksNumber
    let amountToSend

    const tokenSymbol = 'ETH'
    const tokenDecimals = 18
    const proxyBalance = await provider.getBalance(proxyAddress)

    if (proxyBalance < cost) {
      amountToSend = cost - proxyBalance

      let spinner = ora({
        text: term.green.str(
          `Sending ${amountToSend /
            Math.pow(10, tokenDecimals)} ${tokenSymbol} to ${proxyAddress} `
        ),
        color: 'green'
      })
      spinner.start()

      const tx = await linkdropMaster.sendTransaction({
        to: proxyAddress,
        value: amountToSend
      })
      spinner.succeed(`Tx Hash: ${tx.hash}`)
    }

    let links = await generateLinksETH()
    return links
  } catch (err) {
    spinner.fail(term.red.str('Failed to generate links'))
    throw newError(err)
  }
})()

export const generateLinksETH = async () => {
  const chainId = getChainId()
  const linksNumber = getLinksNumber()
  const isApprove = getIsApprove()
  const expirationTime = 12345678910 // 03/21/2361 @ 7:15pm (UTC)

  tokenAddress = ethers.constants.AddressZero
  tokenAmount = 0

  let links = []

  for (let i = 0; i < linksNumber; i++) {
    let {
      url,
      linkId,
      linkKey,
      linkdropSignerSignature
    } = await LinkdropSDK.generateLink({
      jsonRpcUrl,
      chainId,
      host,
      linkdropMasterPrivateKey,
      weiAmount,
      tokenAddress,
      tokenAmount,
      expirationTime,
      version,
      isApprove
    })

    let link = { i, linkId, linkKey, linkdropSignerSignature, url }
    links.push(link)
  }

  // Save links to csv
  const dir = path.join(__dirname, '../output')
  const filename = path.join(dir, 'linkdrop_eth.csv')

  try {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir)
    }
    const ws = fs.createWriteStream(filename)
    fastcsv.write(links, { headers: true }).pipe(ws)
    term(`Updated ^_${filename}`)
  } catch (err) {
    throw newError(err)
  }

  return links
}
