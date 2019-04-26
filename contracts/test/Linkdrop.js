/* global describe, before, it */

import chai from 'chai'

import {
  createMockProvider,
  deployContract,
  getWallets,
  solidity
} from 'ethereum-waffle'

import Factory from '../build/Factory'
import Linkdrop from '../build/Linkdrop'
import TokenMock from '../build/TokenMock'

import {
  computeProxyAddress,
  createLink,
  signReceiverAddress
} from '../scripts/utils'

const ethers = require('ethers')

chai.use(solidity)
const { expect } = chai

let provider = createMockProvider()

let [sender, receiver] = getWallets(provider)

let masterCopy
let factory
let proxy
let proxyAddress
let tokenInstance

let link
let receiverAddress
let receiverSignature
let tokenAddress
let claimAmount
let expirationTime

describe('Claim tests', () => {
  before(async () => {
    tokenInstance = await deployContract(sender, TokenMock)
  })

  it('should deploy master copy of linkdrop implementation', async () => {
    masterCopy = await deployContract(sender, Linkdrop)
    expect(masterCopy.address).to.not.eq(ethers.constants.AddressZero)
  })

  it('should deploy factory', async () => {
    factory = await deployContract(sender, Factory, [masterCopy.address], {
      gasLimit: 6000000
    })

    expect(factory.address).to.not.eq(ethers.constants.AddressZero)
  })

  it('should deploy proxy and delegate to implementation', async () => {
    let senderAddress = sender.address

    // Compute next address with js function
    proxyAddress = await computeProxyAddress(
      factory.address,
      senderAddress,
      masterCopy.address
    )

    await factory.deployProxy(senderAddress)

    proxy = new ethers.Contract(proxyAddress, Linkdrop.abi, sender)

    let senderAddr = await proxy.SENDER()
    expect(senderAddress).to.eq(senderAddr)
  })

  it('creates new link key and verifies its signature', async () => {
    tokenAddress = tokenInstance.address
    claimAmount = 100
    expirationTime = 11234234223

    let senderAddress = sender.address

    let senderAddr = await proxy.SENDER()
    expect(senderAddress).to.eq(senderAddr)

    link = await createLink(sender, tokenAddress, claimAmount, expirationTime)

    expect(
      await proxy.verifySenderSignature(
        tokenAddress,
        claimAmount,
        expirationTime,
        link.linkId,
        link.senderSignature
      )
    ).to.be.true
  })

  it('signs receiver address with link key and verifies this signature onchain', async () => {
    link = await createLink(sender, tokenAddress, claimAmount, expirationTime)

    receiverAddress = ethers.Wallet.createRandom().address
    receiverSignature = await signReceiverAddress(link.linkKey, receiverAddress)

    expect(
      await proxy.verifyReceiverSignature(
        link.linkId,
        receiverAddress,
        receiverSignature
      )
    ).to.be.true
  })

  it('should fail to claim tokens when paused', async () => {
    link = await createLink(sender, tokenAddress, claimAmount, expirationTime)

    receiverAddress = ethers.Wallet.createRandom().address
    receiverSignature = await signReceiverAddress(link.linkKey, receiverAddress)

    // Pausing
    await proxy.pause({ gasLimit: 500000 })

    await expect(
      factory.claim(
        tokenAddress,
        claimAmount,
        expirationTime,
        link.linkId,
        sender.address,
        link.senderSignature,
        receiverAddress,
        receiverSignature,
        { gasLimit: 80000 }
      )
    ).to.be.reverted
  })

  it('should fail to claim more than existent amount of tokens', async () => {
    // Unpause
    await proxy.unpause({ gasLimit: 500000 })

    link = await createLink(sender, tokenAddress, claimAmount, expirationTime)
    receiverAddress = ethers.Wallet.createRandom().address
    receiverSignature = await signReceiverAddress(link.linkKey, receiverAddress)

    await expect(
      factory.claim(
        tokenAddress,
        claimAmount,
        expirationTime,
        link.linkId,
        sender.address,
        link.senderSignature,
        receiverAddress,
        receiverSignature,
        { gasLimit: 500000 }
      )
    ).to.be.reverted
  })

  it('should fail to claim tokens by expired link', async () => {
    // Transfering tokens from sender to Linkdrop Contract
    await tokenInstance.transfer(proxy.address, 100000)

    link = await createLink(sender, tokenAddress, claimAmount, 0)
    receiverAddress = ethers.Wallet.createRandom().address
    receiverSignature = await signReceiverAddress(link.linkKey, receiverAddress)

    await expect(
      factory.claim(
        tokenAddress,
        claimAmount,
        0,
        link.linkId,
        sender.address,
        link.senderSignature,
        receiverAddress,
        receiverSignature,
        { gasLimit: 500000 }
      )
    ).to.be.revertedWith('Expired link')
  })

  it('should succesfully claim tokens with valid claim params', async () => {
    // Transfering tokens from sender to Linkdrop Contract
    await tokenInstance.transfer(proxy.address, 10000)

    link = await createLink(sender, tokenAddress, claimAmount, expirationTime)

    receiverAddress = ethers.Wallet.createRandom().address
    receiverSignature = await signReceiverAddress(link.linkKey, receiverAddress)

    await factory.claim(
      tokenAddress,
      claimAmount,
      expirationTime,
      link.linkId,
      sender.address,
      link.senderSignature,
      receiverAddress,
      receiverSignature,
      { gasLimit: 500000 }
    )

    let receiverTokenBalance = await tokenInstance.balanceOf(receiverAddress)
    expect(receiverTokenBalance).to.eq(claimAmount)
  })

  it('should fail to claim link twice', async () => {
    await expect(
      factory.claim(
        tokenAddress,
        claimAmount,
        expirationTime,
        link.linkId,
        sender.address,
        link.senderSignature,
        receiverAddress,
        receiverSignature,
        { gasLimit: 500000 }
      )
    ).to.be.revertedWith('Claimed link')
  })

  it('should fail to claim tokens with fake sender signature', async () => {
    let wallet = ethers.Wallet.createRandom()
    let linkId = wallet.address

    let message = ethers.utils.solidityKeccak256(['address'], [linkId])
    let messageToSign = ethers.utils.arrayify(message)
    let fakeSignature = await receiver.signMessage(messageToSign)

    await expect(
      factory.claim(
        tokenAddress,
        claimAmount,
        expirationTime,
        linkId,
        sender.address,
        fakeSignature,
        receiverAddress,
        receiverSignature,
        { gasLimit: 500000 }
      )
    ).to.be.revertedWith('Invalid sender signature')
  })

  it('should fail to claim tokens with fake receiver signature', async () => {
    link = await createLink(sender, tokenAddress, claimAmount, expirationTime)

    let fakeLink = await createLink(
      sender,
      tokenAddress,
      claimAmount,
      expirationTime
    )
    receiverAddress = ethers.Wallet.createRandom().address
    receiverSignature = await signReceiverAddress(
      fakeLink.linkKey, // signing receiver address with fake link key
      receiverAddress
    )
    await expect(
      factory.claim(
        tokenAddress,
        claimAmount,
        expirationTime,
        link.linkId,
        sender.address,
        link.senderSignature,
        receiverAddress,
        receiverSignature,
        { gasLimit: 500000 }
      )
    ).to.be.revertedWith('Invalid receiver signature')
  })

  it('should fail to claim tokens by canceled link', async () => {
    link = await createLink(sender, tokenAddress, claimAmount, expirationTime)
    receiverAddress = ethers.Wallet.createRandom().address
    receiverSignature = await signReceiverAddress(link.linkKey, receiverAddress)

    await proxy.cancel(link.linkId, { gasLimit: 100000 })

    await expect(
      factory.claim(
        tokenAddress,
        claimAmount,
        expirationTime,
        link.linkId,
        sender.address,
        link.senderSignature,
        receiverAddress,
        receiverSignature,
        { gasLimit: 500000 }
      )
    ).to.be.revertedWith('Canceled link')
  })

  it('should succesully claim ethers', async () => {
    claimAmount = 100 // wei
    link = await createLink(
      sender,
      ethers.constants.AddressZero,
      claimAmount,
      expirationTime
    )
    receiverAddress = ethers.Wallet.createRandom().address
    receiverSignature = await signReceiverAddress(link.linkKey, receiverAddress)

    // send some eth
    let tx = {
      to: proxy.address,
      value: ethers.utils.parseEther('0.5')
    }
    await sender.sendTransaction(tx)

    await expect(
      factory.claim(
        ethers.constants.AddressZero,
        claimAmount,
        expirationTime,
        link.linkId,
        sender.address,
        link.senderSignature,
        receiverAddress,
        receiverSignature,
        { gasLimit: 500000 }
      )
    ).to.emit(proxy, 'Claimed')
  })

  it('should succesfully claim tokens and deploy proxy is not deployed yet', async () => {
    tokenAddress = tokenInstance.address
    claimAmount = 123
    expirationTime = 11234234223

    let proxyAddress = await computeProxyAddress(
      factory.address,
      sender.address,
      masterCopy.address
    )

    // Transfering tokens from sender to Linkdrop Contract
    await tokenInstance.transfer(proxyAddress, 10000)

    // Contract not deployed yet
    proxy = new ethers.Contract(proxyAddress, Linkdrop.abi, sender)

    link = await createLink(sender, tokenAddress, claimAmount, expirationTime)

    receiverAddress = ethers.Wallet.createRandom().address
    receiverSignature = await signReceiverAddress(link.linkKey, receiverAddress)

    await expect(
      factory.claim(
        tokenAddress,
        claimAmount,
        expirationTime,
        link.linkId,
        sender.address, // New
        link.senderSignature,
        receiverAddress,
        receiverSignature,
        { gasLimit: 500000 }
      )
    )
      .to.emit(proxy, 'Claimed')
      .to.emit(tokenInstance, 'Transfer') // should transfer claimed tokens to receiver

    // Now when deployed, check sender
    let senderAddr = await proxy.SENDER()
    expect(sender.address).to.eq(senderAddr)

    let receiverTokenBalance = await tokenInstance.balanceOf(receiverAddress)
    expect(receiverTokenBalance).to.eq(claimAmount)
  })
})
