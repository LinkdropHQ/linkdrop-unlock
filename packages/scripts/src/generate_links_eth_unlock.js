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
const LINKDROP_GAS_FEE = ethers.utils.parseUnits('0.002')
const Lock = { abi: ['function keyPrice() public view returns (uint)'] }

const getScriptArgs = () => {
  const args = require('yargs').argv
  //

  const privateKey = args.pk

  if (!args.pk) {
    throw new Error('Please provide private key (--pk 0x0...00)')
  }
  
  const lock = args.lock
  if (!args.lock) {
    throw new Error('Please provide lock address (--lock 0x0...00)')
  }
  
  if (!args.n) {
    throw new Error('Please provide links number argument: (--n 500)')
  }
  const linksNumber = Number(args.n)
  if (!(linksNumber > 0)) {
    throw new Error('Invalid --n arg: ' + args.n)
  }
  
  const network = args.network
  if (!args.network) {
    throw new Error('Please provide network argument: (--network rinkeby|mainnet)')
  }

  if (args.network !== 'rinkeby' && args.network !== 'mainnet') {
    throw new Error("Network arg should be either 'rinkeby' or 'mainnet'")
  }
  
  return { privateKey, lock, linksNumber, network }
}

export const generate = async () => {
  let spinner, tx
  try {
    spinner = ora({
      text: term.bold.green.str('Generating links'),
      color: 'green'
    })
    spinner.start()
  
  const { privateKey, lock, linksNumber, network } = getScriptArgs()
  
  console.log({ privateKey, lock, linksNumber, network })
  
  throw new Error("WIP WIP WIP")
  
  const provider = getProvider()
  const linkdropMaster = new ethers.Wallet(privateKey, provider)
  const linkdropSDK = new LinkdropSDK({
    linkdropMasterAddress: linkdropMaster.address,
    chain: CHAIN,
    jsonRpcUrl: JSON_RPC_URL,
    factoryAddress: FACTORY_ADDRESS
  })
    const proxyAddress = linkdropSDK.getProxyAddress(CAMPAIGN_ID)

    lock = new ethers.Contract(lock, Lock.abi, provider)
    const keyPrice = await lock.keyPrice()

    const weiCosts = keyPrice.mul(linksNumber)
    const feeCosts = LINKDROP_GAS_FEE.mul(linksNumber)
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
  } catch (err) {
    spinner.fail(term.bold.red.str('Failed to generate links'))
    throw newError(err)
  }
}

generate()
