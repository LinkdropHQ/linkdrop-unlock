import Linkdrop from '../../build/Linkdrop'
import Factory from '../../build/Factory'
import { createLink } from './utils'
const ethers = require('ethers')
const fs = require('fs')
const fastcsv = require('fast-csv')
const path = require('path')
const configPath = path.resolve(__dirname, '../../config/scripts.config.json')
const config = require(configPath)

let {
  networkId,
  senderPrivateKey,
  token,
  amount,
  linksNumber,
  jsonRpcUrl,
  host
} = config

config.token == null || config.token === ''
  ? (token = '0x0000000000000000000000000000000000000000')
  : (token = config.token)

const provider = new ethers.providers.JsonRpcProvider(jsonRpcUrl)

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
  console.log(`#️⃣  Tx Hash: ${txHash}`)

  await linkdrop.deployed()
  console.log(`Deployed linkdrop master copy at ${linkdrop.address}\n`)

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
  console.log(`#️⃣  Tx Hash: ${txHash}`)

  await proxyFactory.deployed()
  console.log(`Deployed proxy factory at ${proxyFactory.address}\n`)

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

    // Construct url
    let url = `${host}/#/receive?token=${token}&amount=${amount}&expirationTime=${expirationTime}&linkKey=${linkKey}&senderAddress=${
      sender.address
    }&senderSignature=${senderSignature}`

    // Add network param to url if not mainnet
    if (String(networkId) !== '1') {
      url = `${url}&n=${networkId}`
    }

    let link = { i, linkId, linkKey, senderSignature, url }
    links.push(link)
  }

  // Save links to csv
  let filename = path.join(__dirname, '../output/linkdrop_eth.csv')
  try {
    const ws = fs.createWriteStream(filename)
    fastcsv.write(links, { headers: true }).pipe(ws)
    console.log(`File ${filename} has been succesfully updated`)
  } catch (err) {
    console.error(err)
  }

  return links
}
