import TokenMock from '../../contracts/build/TokenMock'
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
  getTokenAddress,
  getTokenAmount
} from './utils'

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
const TOKEN_ADDRESS = getTokenAddress()
const TOKEN_AMOUNT = getTokenAmount()

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

    // Send tokens to proxy
    if (TOKEN_AMOUNT > 0 && TOKEN_ADDRESS !== ethers.constants.AddressZero) {
      const cost = TOKEN_AMOUNT * LINKS_NUMBER
      let amount

      const tokenContract = await new ethers.Contract(
        TOKEN_ADDRESS,
        TokenMock.abi,
        LINKDROP_MASTER_WALLET
      )
      const tokenSymbol = await tokenContract.symbol()
      const tokenDecimals = await tokenContract.decimals()

      if (String(IS_APPROVE) === 'false') {
        const proxyBalance = await tokenContract.balanceOf(proxyAddress)
        if (proxyBalance < cost) {
          amount = cost - proxyBalance

          spinner.info(
            term.bold.str(
              `Transfering ${amount /
                Math.pow(10, tokenDecimals)} ${tokenSymbol} to ${proxyAddress}`
            )
          )
          // Transfer
          tx = await tokenContract.transfer(proxyAddress, amount, {
            gasLimit: 600000
          })
          term.bold(`Tx Hash: ^g${tx.hash}\n`)
        }
      } else if (String(IS_APPROVE) === 'true') {
        const proxyAllowance = await tokenContract.allowance(
          LINKDROP_MASTER_WALLET.address,
          proxyAddress
        )
        if (proxyAllowance < cost) {
          spinner.info(
            term.bold.str(
              `Approving ${cost /
                Math.pow(10, tokenDecimals)} ${tokenSymbol} to ${proxyAddress}`
            )
          )
          // Approve
          tx = await tokenContract.approve(proxyAddress, cost, {
            gasLimit: 600000
          })
          term.bold(`Tx Hash: ^g${tx.hash}\n`)
        }
      }
    }
    // Send eth to proxy
    if (WEI_AMOUNT > 0) {
      let cost = WEI_AMOUNT * LINKS_NUMBER
      let amountToSend

      const tokenSymbol = 'ETH'
      const tokenDecimals = 18
      const proxyBalance = await PROVIDER.getBalance(proxyAddress)

      // Transfer funds
      if (proxyBalance < cost) {
        amountToSend = cost - proxyBalance

        spinner.info(
          term.bold.str(
            `Sending ${amountToSend /
              Math.pow(10, tokenDecimals)} ${tokenSymbol} to ${proxyAddress}`
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
    } catch (err) {
      throw newError(err)
    }

    spinner.succeed(term.bold.str(`Saved links to ^_${filename}`))

    return links
  } catch (err) {
    spinner.fail(term.bold.red.str('Failed to generate links'))
    throw newError(err)
  }
}

generate()
