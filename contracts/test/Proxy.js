/* global describe, before, it */

import chai from 'chai'

import {
  createMockProvider,
  deployContract,
  getWallets,
  solidity
} from 'ethereum-waffle'

import TokenMock from '../build/TokenMock'
import Factory from '../build/Factory'
import Linkdrop from '../build/Linkdrop'
import Proxy from '../build/Proxy'
import Wrapper from '../build/Wrapper'

import { computeProxyAddress } from '../src/utils'

const ethers = require('ethers')

chai.use(solidity)
const { expect } = chai

let provider = createMockProvider()

let [sender, receiver, third] = getWallets(provider)
console.log('receiver: ', receiver.address)
console.log('sender: ', sender.address)

let tokenInstance
let linkdropInstance // masterCopy
let factory
let proxy
let link
let receiverAddress
let receiverSignature
let tokenAddress
let claimAmount
let expirationTime

// Should be signed by sender
const signLink = async function (
  tokenAddress,
  claimAmount,
  expirationTime,
  linkId
) {
  let messageHash = ethers.utils.solidityKeccak256(
    ['address', 'uint', 'uint', 'address'],
    [tokenAddress, claimAmount, expirationTime, linkId]
  )
  let messageHashToSign = ethers.utils.arrayify(messageHash)
  let signature = await sender.signMessage(messageHashToSign)
  return signature
}

// Generates new link
const createLink = async function (tokenAddress, claimAmount, expirationTime) {
  let linkWallet = ethers.Wallet.createRandom()
  let linkKey = linkWallet.privateKey
  let linkId = linkWallet.address
  let senderSignature = await signLink(
    tokenAddress,
    claimAmount,
    expirationTime,
    linkId
  )
  return {
    linkKey, // link's ephemeral private key
    linkId, // address corresponding to link key
    senderSignature // signed by linkdrop verifier
  }
}

const signReceiverAddress = async function (linkKey, receiverAddress) {
  let wallet = new ethers.Wallet(linkKey)
  let messageHash = ethers.utils.solidityKeccak256(
    ['address'],
    [receiverAddress]
  )
  let messageHashToSign = ethers.utils.arrayify(messageHash)
  let signature = await wallet.signMessage(messageHashToSign)
  return signature
}
let masterCopy

describe('Linkdrop tests', () => {
  before(async () => {
    tokenInstance = await deployContract(sender, TokenMock)
  })

  it('should deploy master copy of linkdrop contract', async () => {
    masterCopy = await deployContract(sender, Linkdrop)
    console.log('masterCopy: ', masterCopy.address)
  })

  let shit = `0x${Proxy.bytecode}14723a09acff6d2a60dcdf7aa4aff308fddc160c`

  it('should deploy factory', async () => {
    factory = await deployContract(sender, Factory, [shit], {
      gasLimit: 6000000
    })
    console.log('factory: ', factory.address)
  })

  let proxyInstance

  it('should deploy proxy', async () => {
    await factory.deployProxy(sender.address)

    let contractsDeployed = await factory.contractsDeployed()
    console.log('contractsDeployed: ', +contractsDeployed)

    let addr = await factory.proxies(contractsDeployed)
    proxyInstance = new ethers.Contract(addr, Wrapper.abi, sender)

    console.log('addr: ', addr)

    let sende = await proxyInstance.SENDER()
    console.log('sender: ', sende)

    let owne = await proxyInstance.owner()
    console.log('owner: ', owne)
  })

  //   function buildCreate2Address (creatorAddress, saltHex, byteCode) {
  //     const parts = [
  //       'ff',
  //       creatorAddress,
  //       saltHex.toString(),
  //       ethers.utils.keccak256(byteCode)
  //     ].map(part => (part.startsWith('0x') ? part.slice(2) : part))

  //     const partsHash = ethers.utils.keccak256(`0x${parts.join('')}`)

  //     return `0x${partsHash.slice(-40)}`.toLowerCase()
  //   }

  it('should deploy another proxy', async () => {
    let newAddr = await factory.findCreate2Address(receiver.address)
    console.log('newAddr: ', newAddr)

    let newAddr2 = await computeProxyAddress(factory.address, receiver.address)
    console.log('newAddr2: ', newAddr2)

    await factory.deployProxy(receiver.address)

    let contractsDeployed = await factory.contractsDeployed()
    console.log('contractsDeployed: ', +contractsDeployed)

    let addr = await factory.proxies(contractsDeployed)
    proxyInstance = new ethers.Contract(addr, Wrapper.abi, sender)

    console.log('addr: ', addr)

    let sende = await proxyInstance.SENDER()
    console.log('sender: ', sende)

    let owne = await proxyInstance.owner()
    console.log('owner: ', owne)
  })

  //   it('should deploy another proxy', async () => {
  //     await factory.deployProxy(third.address)

  //     let contractsDeployed = await factory.contractsDeployed()
  //     console.log('contractsDeployed: ', +contractsDeployed)

  //     let addr = await factory.proxies(contractsDeployed)
  //     // let instance = new ethers.Contract(addr, Linkdrop.abi, provider)

  //     console.log('addr: ', addr)
  //     // let sende = await newLinkdrop.SENDER()
  //     // console.log('sender: ', sende)
  //   })

  //   it('assigns owner of the contract as sender', async () => {
  //     expect(await linkdropInstance.SENDER()).to.eq(sender.address)
  //   })

  //   it('assigns initial token balance of sender', async () => {
  //     expect(await tokenInstance.balanceOf(sender.address)).to.eq(1000000000)
  //   })

  //   it('creates new link key and verifies its signature', async () => {
  //     tokenAddress = tokenInstance.address
  //     claimAmount = 100
  //     expirationTime = 11234234223

  //     link = await createLink(tokenAddress, claimAmount, expirationTime)

  //     expect(
  //       await linkdropInstance.verifySenderSignature(
  //         tokenAddress,
  //         claimAmount,
  //         expirationTime,
  //         link.linkId,
  //         link.senderSignature
  //       )
  //     ).to.be.true
  //   })

  //   it('signs receiver address with link key and verifies this signature onchain', async () => {
  //     link = await createLink(tokenAddress, claimAmount, expirationTime)

  //     receiverAddress = ethers.Wallet.createRandom().address
  //     receiverSignature = await signReceiverAddress(link.linkKey, receiverAddress)

  //     expect(
  //       await linkdropInstance.verifyReceiverSignature(
  //         link.linkId,
  //         receiverAddress,
  //         receiverSignature
  //       )
  //     ).to.be.true
  //   })

  //   it('should fail to claim tokens when paused', async () => {
  //     link = await createLink(tokenAddress, claimAmount, expirationTime)

  //     receiverAddress = ethers.Wallet.createRandom().address
  //     receiverSignature = await signReceiverAddress(link.linkKey, receiverAddress)

  //     await linkdropInstance.pause() // Pausing contract

  //     await expect(
  //       linkdropInstance.claim(
  //         tokenAddress,
  //         claimAmount,
  //         expirationTime,
  //         link.linkId,
  //         link.senderSignature,
  //         receiverAddress,
  //         receiverSignature,
  //         { gasLimit: 80000 }
  //       )
  //     ).to.be.reverted
  //   })

  //   it('should fail to claim more than approved amount of tokens', async () => {
  //     await linkdropInstance.unpause() // Unpausing

  //     link = await createLink(tokenAddress, claimAmount, expirationTime)
  //     receiverAddress = ethers.Wallet.createRandom().address
  //     receiverSignature = await signReceiverAddress(link.linkKey, receiverAddress)
  //     await expect(
  //       linkdropInstance.claim(
  //         tokenAddress,
  //         claimAmount,
  //         expirationTime,
  //         link.linkId,
  //         link.senderSignature,
  //         receiverAddress,
  //         receiverSignature,
  //         { gasLimit: 500000 }
  //       )
  //     ).to.be.reverted
  //   })

  //   it('should fail to claim tokens by expired link', async () => {
  //     // Approving tokens from sender to Linkdrop Contract
  //     await tokenInstance.approve(linkdropInstance.address, 100000)

  //     link = await createLink(tokenAddress, claimAmount, 0)
  //     receiverAddress = ethers.Wallet.createRandom().address
  //     receiverSignature = await signReceiverAddress(link.linkKey, receiverAddress)

  //     await expect(
  //       linkdropInstance.claim(
  //         tokenAddress,
  //         claimAmount,
  //         0,
  //         link.linkId,
  //         link.senderSignature,
  //         receiverAddress,
  //         receiverSignature,
  //         { gasLimit: 500000 }
  //       )
  //     ).to.be.revertedWith('Link has expired')
  //   })

  //   it('should succesfully claim tokens with valid claim params', async () => {
  //     // Approving tokens from sender to Linkdrop Contract
  //     await tokenInstance.approve(linkdropInstance.address, 100000)

  //     link = await createLink(tokenAddress, claimAmount, expirationTime)

  //     receiverAddress = ethers.Wallet.createRandom().address
  //     receiverSignature = await signReceiverAddress(link.linkKey, receiverAddress)

  //     await expect(
  //       linkdropInstance.claim(
  //         tokenAddress,
  //         claimAmount,
  //         expirationTime,
  //         link.linkId,
  //         link.senderSignature,
  //         receiverAddress,
  //         receiverSignature,
  //         { gasLimit: 500000 }
  //       )
  //     )
  //       .to.emit(linkdropInstance, 'Claimed')
  //       .to.emit(tokenInstance, 'Transfer') // should transfer claimed tokens to receiver
  //       .withArgs(sender.address, receiverAddress, claimAmount)

  //     let receiverTokenBalance = await tokenInstance.balanceOf(receiverAddress)
  //     expect(receiverTokenBalance).to.eq(claimAmount)
  //   })

  //   it('should fail to claim link twice', async () => {
  //     await expect(
  //       linkdropInstance.claim(
  //         tokenAddress,
  //         claimAmount,
  //         expirationTime,
  //         link.linkId,
  //         link.senderSignature,
  //         receiverAddress,
  //         receiverSignature,
  //         { gasLimit: 500000 }
  //       )
  //     ).to.be.revertedWith('Link has already been claimed')
  //   })

  //   it('should fail to claim tokens with fake sender signature', async () => {
  //     let wallet = ethers.Wallet.createRandom()
  //     let linkId = wallet.address

  //     let message = ethers.utils.solidityKeccak256(['address'], [linkId])
  //     let messageToSign = ethers.utils.arrayify(message)
  //     let fakeSignature = await receiver.signMessage(messageToSign)

  //     await expect(
  //       linkdropInstance.claim(
  //         tokenAddress,
  //         claimAmount,
  //         expirationTime,
  //         linkId,
  //         fakeSignature,
  //         receiverAddress,
  //         receiverSignature,
  //         { gasLimit: 500000 }
  //       )
  //     ).to.be.revertedWith('Link key is not signed by sender verification key')
  //   })

  //   it('should fail to claim tokens with fake receiver signature', async () => {
  //     link = await createLink(tokenAddress, claimAmount, expirationTime)
  //     let fakeLink = await createLink(tokenAddress, claimAmount, expirationTime)
  //     receiverAddress = ethers.Wallet.createRandom().address
  //     receiverSignature = await signReceiverAddress(
  //       fakeLink.linkKey, // signing receiver address with fake link key
  //       receiverAddress
  //     )
  //     await expect(
  //       linkdropInstance.claim(
  //         tokenAddress,
  //         claimAmount,
  //         expirationTime,
  //         link.linkId,
  //         link.senderSignature,
  //         receiverAddress,
  //         receiverSignature,
  //         { gasLimit: 500000 }
  //       )
  //     ).to.be.revertedWith('Receiver address is not signed by link key')
  //   })

  //   it('should fail to claim tokens by canceled link', async () => {
  //     link = await createLink(tokenAddress, claimAmount, expirationTime)
  //     receiverAddress = ethers.Wallet.createRandom().address
  //     receiverSignature = await signReceiverAddress(link.linkKey, receiverAddress)

  //     await linkdropInstance.cancel(link.linkId)

  //     await expect(
  //       linkdropInstance.claim(
  //         tokenAddress,
  //         claimAmount,
  //         expirationTime,
  //         link.linkId,
  //         link.senderSignature,
  //         receiverAddress,
  //         receiverSignature,
  //         { gasLimit: 500000 }
  //       )
  //     ).to.be.revertedWith('Link has been canceled')
  //   })

  //   it('should succesully claim ethers', async () => {
  //     claimAmount = 100 // wei
  //     link = await createLink(
  //       ethers.constants.AddressZero,
  //       claimAmount,
  //       expirationTime
  //     )
  //     receiverAddress = ethers.Wallet.createRandom().address
  //     receiverSignature = await signReceiverAddress(link.linkKey, receiverAddress)

  //     // send some eth
  //     let tx = {
  //       to: linkdropInstance.address,
  //       value: ethers.utils.parseEther('0.5')
  //     }
  //     await sender.sendTransaction(tx)

  //     await expect(
  //       linkdropInstance.claim(
  //         ethers.constants.AddressZero,
  //         claimAmount,
  //         expirationTime,
  //         link.linkId,
  //         link.senderSignature,
  //         receiverAddress,
  //         receiverSignature,
  //         { gasLimit: 500000 }
  //       )
  //     ).to.emit(linkdropInstance, 'Claimed')
  //   })
})
