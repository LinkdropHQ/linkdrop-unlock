import {
  JSON_RPC_URL,
  HOST,
  LINKDROP_MASTER_PRIVATE_KEY,
  LINKDROP_MASTER_WALLET,
  LINKDROP_FACTORY_ADDRESS,
  NFT_ADDRESS,
  TOKEN_ADDRESS,
  WEI_AMOUNT,
  TOKEN_AMOUNT,
  NFT_IDS,
  LINKS_NUMBER,
  RECEIVER_ADDRESS,
  LINKDROP_MASTER_COPY_VERSION,
  LINKDROP_MASTER_COPY_ADDRESS,
  INIT_CODE,
  CHAIN_ID,
  IS_APPROVE,
  EXPIRATION_TIME,
  PROVIDER,
  newError
} from './utils'

import LinkdropSDK from '../../sdk/src/index'

import ora from 'ora'
import { terminal as term } from 'terminal-kit'
import { ethers } from 'ethers'
import path from 'path'
import fastcsv from 'fast-csv'
import fs from 'fs'

export const generate = async () => {
  let spinner
  try {
    spinner = ora({
      text: term.green.str('Generating links'),
      color: 'green'
    }).start()
    const { tx, spinner: topUpSpinner } = await topUp()
    if (tx && topUpSpinner) {
      topUpSpinner.succeed('Yeah')
      spinner.succeed(`${tx.hash}`)
    }
    let { links, message } = await generateLinksETH()
    if (links) {
      spinner.succeed(message)
    }
    return links
  } catch (err) {
    spinner.fail(term.red.str('Failed to generate links'))
    throw newError(err)
  }
}

export const generateLinksETH = async () => {
  let message

  const tokenAddress = ethers.constants.AddressZero
  const tokenAmount = 0

  let links = []

  for (let i = 0; i < LINKS_NUMBER; i++) {
    let {
      url,
      linkId,
      linkKey,
      linkdropSignerSignature
    } = await LinkdropSDK.generateLink({
      jsonRpcUrl: JSON_RPC_URL,
      chainId: CHAIN_ID,
      host: HOST,
      linkdropMasterPrivateKey: LINKDROP_MASTER_PRIVATE_KEY,
      weiAmount: WEI_AMOUNT,
      tokenAddress,
      tokenAmount,
      expirationTime: EXPIRATION_TIME,
      version: LINKDROP_MASTER_COPY_VERSION,
      isApprove: IS_APPROVE
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

    message = term.bold.str(`Updated ^_${filename}`)
  } catch (err) {
    throw newError(err)
  }
  return { links, message }
}

export const topUp = async () => {
  let tx, spinner

  const proxyAddress = LinkdropSDK.computeProxyAddress(
    LINKDROP_FACTORY_ADDRESS,
    LINKDROP_MASTER_WALLET.address,
    INIT_CODE
  )

  // Send eth to proxy
  let cost = WEI_AMOUNT * LINKS_NUMBER
  let amountToSend

  const tokenSymbol = 'ETH'
  const tokenDecimals = 18
  const proxyBalance = await PROVIDER.getBalance(proxyAddress)

  if (proxyBalance < cost) {
    amountToSend = cost - proxyBalance

    spinner = ora({
      text: term.green.str(
        `Sending ${amountToSend /
          Math.pow(10, tokenDecimals)} ${tokenSymbol} to ${proxyAddress} `
      ),
      color: 'green'
    }).start()

    tx = await LINKDROP_MASTER_WALLET.sendTransaction({
      to: proxyAddress,
      value: amountToSend
    })
  }
  return { tx, spinner }
}

generate()
