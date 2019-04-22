import Factory from '../build/Factory'
import { createLink, signReceiverAddress } from './utils'

const ethers = require('ethers')
const path = require('path')
const configPath = path.resolve(__dirname, '../config/config.json')
const config = require(configPath)

// Service

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
const sender = new ethers.Wallet(senderPrivateKey, provider)

export const claim = async ({
  token,
  amount,
  expirationTime,
  linkId,
  senderAddress,
  senderSignature,
  receiverAddress,
  receiverSignature
}) => {
  let proxyFactory = new ethers.Contract(factory, Factory.abi, sender)

  let tx = await proxyFactory.claim(
    token,
    amount,
    expirationTime,
    linkId,
    senderAddress,
    senderSignature,
    receiverAddress,
    receiverSignature
  )

  // Wait for 2 confirmations in the network
  tx.wait(2)
  console.log('tx: ', tx.hash)
}

const getRandomClaimParams = async () => {
  let expirationTime = 1900000000000000

  let { linkKey, linkId, senderSignature } = await createLink(
    sender,
    token,
    amount,
    expirationTime
  )

  let receiverAddress = ethers.Wallet.createRandom().address
  let receiverSignature = await signReceiverAddress(linkKey, receiverAddress)
  let senderAddress = sender.address

  let claimParams = {
    token,
    amount,
    expirationTime,
    linkId,
    senderAddress,
    senderSignature,
    receiverAddress,
    receiverSignature
  }
  console.log('claimParams: ', claimParams)
  return claimParams
}

;(async () => {
  let params = await getRandomClaimParams()
  console.log('Claiming...')
  await claim(params)
})()
