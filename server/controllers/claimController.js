import { signReceiverAddress } from '../utils/utils'
import Factory from '../../build/Factory'
const ethers = require('ethers')

const path = require('path')
const configPath = path.resolve(__dirname, '../../config/config.json')
const config = require(configPath)

const { senderPrivateKey, network, factory, networkId } = config

const provider = ethers.getDefaultProvider(network)
const relayer = new ethers.Wallet(senderPrivateKey, provider)

export const claim = async (req, res) => {
  const {
    token,
    amount,
    expirationTime,
    linkKey,
    senderAddress,
    senderSignature
  } = req.body

  const linkId = new ethers.Wallet(linkKey, provider).address

  const receiverAddress = ethers.Wallet.createRandom().address
  const receiverSignature = await signReceiverAddress(linkKey, receiverAddress)

  const claimParams = {
    token,
    amount,
    expirationTime,
    linkId,
    senderAddress,
    senderSignature,
    receiverAddress,
    receiverSignature
  }

  if (!token) {
    throw new Error('Please provide token address')
  }

  if (!amount) {
    throw new Error('Please provide amount to claim')
  }

  if (!expirationTime) {
    throw new Error('Please provide expiration time')
  }

  if (!linkKey) {
    throw new Error('Please provide the link ket to sign receiver address with')
  }

  if (!senderAddress) {
    throw new Error(`Please provide sender's address`)
  }

  if (!senderSignature) {
    throw new Error('Please provide sender signature')
  }

  if (!receiverAddress) {
    throw new Error(`Please provide receiver's address`)
  }

  if (!receiverSignature) {
    throw new Error('Please provide receiver signature')
  }

  let proxyFactory = new ethers.Contract(factory, Factory.abi, relayer)

  try {
    console.log('Claiming ...', claimParams)

    let tx = await proxyFactory.claim(
      token,
      amount,
      expirationTime,
      linkId,
      senderAddress,
      senderSignature,
      receiverAddress,
      receiverSignature,
      { gasLimit: 500000 }
    )

    let url
    networkId !== 1
      ? (url = `https://${network}.etherscan.io/tx/${tx.hash}`)
      : `https://etherscan.io/tx/${tx.hash}`

    console.log(`🌐  ${url}`)

    // Wait for 2 confirmations in the network
    tx.wait(2)

    const receipt = await provider.getTransactionReceipt(tx.hash)

    let success
    receipt.status === 1 ? (success = true) : (success = false)

    res.json({
      success: success,
      txHash: tx.hash
    })
  } catch (err) {
    console.error(err)
  }
}
