import Linkdrop from '../build/Linkdrop'
import Factory from '../build/Factory'
import chai from 'chai'
import { computeProxyAddress, createLink, signReceiverAddress } from './utils'
const ethers = require('ethers')
const fs = require('fs')
const fastcsv = require('fast-csv')
const path = require('path')
const { expect } = chai
require('custom-env').env()

// const provider = new ethers.providers.JsonRpcProvider()
// let senderPrivateKey =
//   '0x111b0b6757ec45861340f853dec86991c5bf333f02519d6fd3200b5889146104'

let network = process.env.NETWORK
let senderPrivateKey = process.env.SENDER_PRIVATE_KEY
const provider = ethers.getDefaultProvider(network)

let linksNumber = process.env.LINKS_NUMBER
let token
process.env.TOKEN == null || process.env.TOKEN === ''
  ? (token = '0x0000000000000000000000000000000000000000')
  : (token = process.env.TOKEN)

let networkId = process.env.NETWORK_ID
let host = process.env.HOST
let amount = process.env.AMOUNT

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

export const deployLinkdropMasterCopy = async () => {
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
  console.log(`Deployed linkdrop contract ${url}`)

  // Add a line to .env file, using appendFile
  fs.appendFile('.env', `\nLINKDROP_MASTER_COPY="${linkdrop.address}"`, err => {
    if (err) throw err
    console.log('Linkdrop mastercopy address was added to .env file!')
  })

  return linkdrop.address
}

export const deployFactory = async linkdropMasterCopyAddress => {
  let factory = new ethers.ContractFactory(
    Factory.abi,
    Factory.bytecode,
    sender
  )

  proxyFactory = await factory.deploy(linkdropMasterCopyAddress, {
    gasLimit: 6000000
  })

  let txHash = proxyFactory.deployTransaction.hash
  let url
  networkId !== 1
    ? (url = `https://${network}.etherscan.io/tx/${txHash}`)
    : `https://etherscan.io/tx/${txHash}`

  await proxyFactory.deployed()
  console.log(`Deployed proxy factory contract ${url}`)

  // Add a line to .env file, using appendFile
  fs.appendFile('.env', `\nFACTORY="${proxyFactory.address}"`, err => {
    if (err) throw err
    console.log('Proxy factory address was added to .env file!')
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
