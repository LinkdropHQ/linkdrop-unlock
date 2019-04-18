import Linkdrop from '../build/Linkdrop'
import Factory from '../build/Factory'
import chai from 'chai'
import { computeProxyAddress, createLink, signReceiverAddress } from './utils'
require('custom-env').env('rinkeby')
const ethers = require('ethers')
const fs = require('fs')
const fastcsv = require('fast-csv')
const path = require('path')
const { expect } = chai

let network = process.env.NETWORK

// const provider = new ethers.providers.JsonRpcProvider()
// let senderPrivateKey =
//   '0xd0a94e2af5aa29134498e0a02ade92f0097596f6c91bc734d29eba465d965528'

let senderPrivateKey = process.env.SENDER_PRIVATE_KEY
const provider = ethers.getDefaultProvider(network)

let amount = process.env.AMOUNT
let linksNumber = process.env.LINKS_NUMBER
let token
process.env.TOKEN == null || process.env.TOKEN === ''
  ? (token = '0x0000000000000000000000000000000000000000')
  : (token = process.env.TOKEN)

let networkId = process.env.NETWORK_ID
let host = process.env.HOST

// Make sure we have these set in dotenv file
if (senderPrivateKey == null || senderPrivateKey === '') {
  throw "Please provide a sender's private key"
}
// if (network == null || network === '') throw 'Please provide network'
if (amount == null || amount === '') throw 'Please provide amount per link'
if (linksNumber == null || linksNumber == '') {
  throw 'Please provide links number'
}

// Connect to a custom URL
// const provider = new ethers.providers.JsonRpcProvider(process.env.JSON_RPC_URL)
// console.log('process.env.JSON_RPC_URL: ', process.env.JSON_RPC_URL)

const sender = new ethers.Wallet(senderPrivateKey, provider)

let linkdrop

let proxyFactory

let proxy

let expirationTime

const deployLinkdrop = async () => {
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

  return linkdrop.address
}

const deployFactory = async linkdropAddress => {
  let factory = new ethers.ContractFactory(
    Factory.abi,
    Factory.bytecode,
    sender
  )

  proxyFactory = await factory.deploy(linkdropAddress, {
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
  fs.appendFile('.env.rinkeby', `\nFACTORY="${proxyFactory.address}"`, err => {
    if (err) throw err
    console.log('Proxy factory address was added to .env.rinkeby file!')
  })

  return proxyFactory.address
}

// Pass wallet object as sender param
const deployProxy = async (proxyFactoryAddress, sender) => {
  if (proxyFactoryAddress === ethers.constants.AddressZero) {
    throw 'Factory contract is not deployed'
  }

  // Get factory contract
  let factory = new ethers.Contract(proxyFactoryAddress, Factory.abi, sender)

  // Compute next address
  let expectedAddress = await computeProxyAddress(
    proxyFactory.address,
    sender.address,
    linkdrop.address
  )

  // Send ethers needed to proxy address
  let balanceBefore = await provider.getBalance(expectedAddress)

  let amountToSend = ethers.utils.parseEther('0.2')

  let userBalance = await provider.getBalance(sender.address)
  if (userBalance < amountToSend) throw 'Insufficient funds to deploy proxy'

  // Send ethers to proxy balance
  let tx = {
    to: expectedAddress,
    gasLimit: 4000000,
    value: amountToSend
  }

  console.log(`Sending 0.2 ethers to ${expectedAddress}...`)
  tx = await sender.sendTransaction(tx)

  let balanceAfter = await provider.getBalance(expectedAddress)

  // expect(+balanceAfter).to.eq(+balanceBefore.add(amountToSend))

  tx = await factory.deployProxy(sender.address)
  let txHash = tx.hash
  let url
  networkId !== 1
    ? (url = `https://${network}.etherscan.io/tx/${txHash}`)
    : `https://etherscan.io/tx/${txHash}`
  // Wait for confirmations
  await tx.wait()
  console.log(`Deployed proxy contract ${url}`)

  proxy = new ethers.Contract(expectedAddress, Linkdrop.abi, sender)

  let senderAddress = await proxy.SENDER()
  expect(sender.address.toString().toLowerCase()).to.eq(
    senderAddress.toString().toLowerCase()
  )

  return proxy.address
}

const generateLinks = async proxyAddress => {
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

const claim = async links => {
  let { linkKey, linkId, senderSignature } = links[0]

  // Get receiver signature
  let receiverAddress = ethers.Wallet.createRandom().address
  let receiverSignature = signReceiverAddress(linkKey, receiverAddress)
  let receiverBalanceBefore = await provider.getBalance(receiverAddress)

  // Check claim params
  let result = await proxy.checkClaimParams(
    token,
    amount,
    expirationTime,
    linkId,
    senderSignature,
    receiverAddress,
    receiverSignature
  )
  console.log('Check claim params resulted: ', result)

  // Claim
  let tx = await proxy.claim(
    token,
    amount,
    expirationTime,
    linkId,
    senderSignature,
    receiverAddress,
    receiverSignature
  )
  let txHash = tx.hash

  let url
  networkId !== 1
    ? (url = `https://${network}.etherscan.io/tx/${txHash}`)
    : `https://etherscan.io/tx/${txHash}`

  console.log(`Succesfully claimed ${url}`)
  let receiverBalanceAfter = await provider.getBalance(receiverAddress)
  // expect(+receiverBalanceAfter).to.eq(+receiverBalanceBefore.add(amount))
}

;(async () => {
  console.log(`Current network: ${process.env.NETWORK}`)
  let linkdrop = await deployLinkdrop()
  let factory = await deployFactory(linkdrop)
  let proxy = await deployProxy(factory, sender)
  let links = await generateLinks(proxy)
  await claim(links)
})()
