import Linkdrop from '../build/Linkdrop'
import Factory from '../build/Factory'
import chai from 'chai'
import { computeProxyAddress, createLink, signReceiverAddress } from './utils'
import { checkNormalize } from 'ethers/errors'
const ethers = require('ethers')
const { expect } = checkNormalize
const fs = require('fs')
const fastcsv = require('fast-csv')
const path = require('path')
const configPath = path.resolve(__dirname, '../config/config.json')
const config = require(configPath)

let {
  network,
  networkId,
  senderPrivateKey,
  token,
  amount,
  linksNumber,
  jsonRpcUrl,
  host,
  masterCopy,
  factory
} = config

config.token == null || config.token === ''
  ? (token = '0x0000000000000000000000000000000000000000')
  : (token = config.token)

const provider = ethers.getDefaultProvider(network)

// Make sure we have these set in dotenv file
if (senderPrivateKey == null || senderPrivateKey === '') {
  throw "Please provide a sender's private key"
}
// if (network == null || network === '') throw 'Please provide network'
if (amount == null || amount === '') throw 'Please provide amount per link'
if (linksNumber == null || linksNumber == '') {
  throw 'Please provide links number'
}

const sender = new ethers.Wallet(senderPrivateKey, provider)
let linkdrop, proxyFactory, expirationTime

export const deployMasterCopy = async () => {
  let factory = new ethers.ContractFactory(
    Linkdrop.abi,
    Linkdrop.bytecode,
    sender
  )

  linkdrop = await factory.deploy()

  let txHash = linkdrop.deployTransaction.hash
  let url
  networkId !== 1
    ? (url = `https://${network}.etherscan.io/tx/${txHash}`)
    : `https://etherscan.io/tx/${txHash}`

  await linkdrop.deployed()
  console.log(`Deployed linkdrop master copy at ${linkdrop.address}\n${url}`)

  config.masterCopy = linkdrop.address

  fs.writeFile(configPath, JSON.stringify(config), err => {
    if (err) throw err
    console.log('Master copy address successfully added to config.json ')
  })

  return linkdrop.address
}

export const deployFactory = async masterCopy => {
  let factory = new ethers.ContractFactory(
    Factory.abi,
    Factory.bytecode,
    sender
  )

  proxyFactory = await factory.deploy(masterCopy, {
    gasLimit: 6000000
  })

  let txHash = proxyFactory.deployTransaction.hash
  let url
  networkId !== 1
    ? (url = `https://${network}.etherscan.io/tx/${txHash}`)
    : `https://etherscan.io/tx/${txHash}`

  await proxyFactory.deployed()
  console.log(`Deployed proxy factory at ${proxyFactory.address}\n${url}`)

  config.factory = proxyFactory.address
  fs.writeFile(configPath, JSON.stringify(config), err => {
    if (err) throw err
    console.log('Proxy factory address successfully added to config.json ')
  })

  return proxyFactory.address
}

export const generateLinks = async proxyAddress => {
  expirationTime = 1900000000000000

  let links = []

  for (let i = 0; i < linksNumber; i++) {
    let { linkKey, linkId, senderSignature } = await createLink(
      sender,
      token,
      amount,
      expirationTime
    )

    // construct url
    let url = `${host}/#/receive?pk=${linkKey.toString(
      'hex'
    )}&sig=${senderSignature}&c=${proxyAddress}`

    // add network param to url if not mainnet
    if (String(networkId) !== '1') {
      url = `${url}&n=${networkId}`
    }

    let link = { i, linkId, linkKey, senderSignature, url }
    links.push(link)
  }

  // Save links to csv
  let filename = path.join(__dirname, '/output/linkdrop_eth.csv')
  try {
    const ws = fs.createWriteStream(filename)
    fastcsv.write(links, { headers: true }).pipe(ws)
    console.log(`File ${filename} has been succesfully updated`)
  } catch (err) {
    console.error(err)
  }

  return links
}
