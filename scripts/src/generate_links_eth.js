import {
  newError,
  getLinkdropMasterWallet,
  getInitCode,
  getExpirationTime,
  getProvider,
  getString,
  getInt,
  getBool
} from './utils'

import LinkdropSDK from '../../sdk/src/index'

import ora from 'ora'
import { terminal as term } from 'terminal-kit'
import { ethers } from 'ethers'
import path from 'path'
import fastcsv from 'fast-csv'
import fs from 'fs'

const JSON_RPC_URL = getString('jsonRpcUrl')
const HOST = getString('host')
const LINKDROP_MASTER_PRIVATE_KEY = getString('linkdropMasterPrivateKey')
const LINKDROP_FACTORY_ADDRESS = getString('factory')
const WEI_AMOUNT = getInt('weiAmount')
const LINKS_NUMBER = getInt('linksNumber')
const LINKDROP_MASTER_COPY_VERSION = getInt('version')
const CHAIN_ID = getInt('chainId')
const EXPIRATION_TIME = getExpirationTime()
const IS_APPROVE = getBool('isApprove')
const PROVIDER = getProvider()
const LINKDROP_MASTER_WALLET = getLinkdropMasterWallet()
const INIT_CODE = getInitCode()

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

    let cost = WEI_AMOUNT * LINKS_NUMBER
    let amountToSend

    const tokenSymbol = 'ETH'
    const tokenDecimals = 18
    const proxyBalance = await PROVIDER.getBalance(proxyAddress)

    if (proxyBalance < cost) {
      // Transfer ethers
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

    // Generate links
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
        tokenAddress: ethers.constants.AddressZero,
        tokenAmount: 0,
        expirationTime: EXPIRATION_TIME,
        version: LINKDROP_MASTER_COPY_VERSION,
        isApprove: IS_APPROVE
      })

      let link = { i, linkId, linkKey, linkdropSignerSignature, url }
      links.push(link)
    }

    // Save links
    const dir = path.join(__dirname, '../output')
    const filename = path.join(dir, 'linkdrop_eth.csv')

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
