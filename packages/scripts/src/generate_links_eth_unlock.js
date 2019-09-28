import {
  newError,
  getLinkdropMasterWallet,
  getExpirationTime,
  getProvider,
  getString,
  getInt
} from './utils'

import LinkdropSDK from '../../sdk/src'
import ora from 'ora'
import { terminal as term } from 'terminal-kit'
import { ethers } from 'ethers'
import path from 'path'
import fastcsv from 'fast-csv'
import fs from 'fs'
import deployProxyIfNeeded from './deploy_proxy'

const JSON_RPC_URL = getString('jsonRpcUrl')
const CHAIN = getString('CHAIN')
const EXPIRATION_TIME = getExpirationTime()
const CAMPAIGN_ID = getInt('CAMPAIGN_ID')
const FACTORY_ADDRESS = getString('FACTORY_ADDRESS')
const GAS_FEE = ethers.utils.parseUnits('0.002')

const args = require('yargs').argv

const Lock = { abi: ['function keyPrice() public view returns (uint)'] }

const provider = getProvider()
const privateKey = args.pk
let lock = args.lock

let linksNumber = args.n || 1

const linkdropMaster = new ethers.Wallet(privateKey, provider)
const linkdropSDK = new LinkdropSDK({
  linkdropMasterAddress: linkdropMaster.address,
  chain: CHAIN,
  jsonRpcUrl: JSON_RPC_URL,
  factoryAddress: FACTORY_ADDRESS
})

export const generate = async () => {
  let spinner, tx
  // try {
    spinner = ora({
      text: term.bold.green.str('Generating links'),
      color: 'green'
    })
    spinner.start()

    const proxyAddress = linkdropSDK.getProxyAddress(CAMPAIGN_ID)

    lock = new ethers.Contract(lock, Lock.abi, provider)
    const keyPrice = await lock.keyPrice()

    const weiCosts = keyPrice.mul(linksNumber)
    const feeCosts = GAS_FEE.mul(linksNumber)
    const totalCosts = weiCosts.add(feeCosts)

    let amountToSend

    const tokenSymbol = 'ETH'
    const tokenDecimals = 18
    const proxyBalance = await provider.getBalance(proxyAddress)

    // check that proxy address is deployed
  await deployProxyIfNeeded(spinner, privateKey)
  
  if (proxyBalance.lt(totalCosts)) {
    
    console.log({ proxyBalance })
    
    // Transfer ethers
    amountToSend = totalCosts.sub(proxyBalance)
    
   
    spinner.info(
      term.bold.str(
        `Sending ${amountToSend /
                   Math.pow(10, tokenDecimals)} ${tokenSymbol} to ^g${proxyAddress}`
      )
    )
      
    tx = await linkdropMaster.sendTransaction({
      to: proxyAddress,
      value: amountToSend,
      gasLimit: 23000
    })
      
    term.bold(`Tx Hash: ^g${tx.hash}\n`)
  }
   
    // Generate links
    let links = []

    for (let i = 0; i < linksNumber; i++) {
      let {
        url,
        linkId,
        linkKey,
        linkdropSignerSignature
      } = await linkdropSDK.generateLinkUnlock({
        signingKeyOrWallet: privateKey,
        weiAmount: keyPrice,
        tokenAddress: ethers.constants.AddressZero,
        tokenAmount: 0,
        expirationTime: EXPIRATION_TIME,
        campaignId: CAMPAIGN_ID,
        lock: lock.address
      })

      let link = { i, linkId, linkKey, linkdropSignerSignature, url }
      links.push(link)
    }

    // Save links
    const dir = path.join(__dirname, '../output')
    const filename = path.join(dir, 'linkdrop_eth_unlock.csv')

    // try {
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir)
      }
      const ws = fs.createWriteStream(filename)
      fastcsv.write(links, { headers: true }).pipe(ws)
    // } catch (err) {
    //   throw newError(err)
    // }

    spinner.succeed(term.bold.str(`Generated and saved links to ^_${filename}`))

    return links
  // } catch (err) {
  //   spinner.fail(term.bold.red.str('Failed to generate links'))
  //   throw newError(err)
  // }
}

generate()
