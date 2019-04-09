/* global describe, before, it */

import chai from 'chai'

import {
  createMockProvider,
  deployContract,
  getWallets,
  solidity
} from 'ethereum-waffle'

import TokenMock from '../build/TokenMock'
import NFTMock from '../build/NFTMock'
import Linkdrop from '../build/Linkdrop'
const ethers = require('ethers')

chai.use(solidity)
const { expect } = chai

let provider = createMockProvider()

let [sender, linkdropVerifier, receiver] = getWallets(provider)

const SENDER_VERIFICATION_ADDRESS = linkdropVerifier.address

let tokenInstance
let nftInstance
let linkdropInstance
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
  let signature = await linkdropVerifier.signMessage(messageHashToSign)
  return signature
}

const signLinkERC721 = async function (
  tokenAddress,
  tokenId,
  expirationTime,
  linkId
) {
  let messageHash = ethers.utils.solidityKeccak256(
    ['address', 'uint', 'uint', 'address'],
    [tokenAddress, tokenId, expirationTime, linkId]
  )
  let messageHashToSign = ethers.utils.arrayify(messageHash)
  let signature = await linkdropVerifier.signMessage(messageHashToSign)
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

const createLinkERC721 = async function (tokenAddress, tokenId, expirationTime) {
  let linkWallet = ethers.Wallet.createRandom()
  let linkKey = linkWallet.privateKey
  let linkId = linkWallet.address
  let senderSignature = await signLinkERC721(
    tokenAddress,
    tokenId,
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

describe('Linkdrop tests', () => {
  before(async () => {
    tokenInstance = await deployContract(sender, TokenMock)
    nftInstance = await deployContract(sender, NFTMock)

    linkdropInstance = await deployContract(
      sender,
      Linkdrop,
      [sender.address, SENDER_VERIFICATION_ADDRESS],
      { gasLimit: 4000000 }
    )
  })

  it('assigns owner of the contract as sender', async () => {
    expect(await linkdropInstance.SENDER()).to.eq(sender.address)
  })

  it('assigns correct linkdrop verification address', async () => {
    expect(await linkdropInstance.SENDER_VERIFICATION_ADDRESS()).to.eq(
      SENDER_VERIFICATION_ADDRESS
    )
  })

  it('assigns initial token balance of sender', async () => {
    expect(await tokenInstance.balanceOf(sender.address)).to.eq(1000000000)
  })

  it('creates new link key and verifies its signature', async () => {
    tokenAddress = tokenInstance.address
    claimAmount = 100
    expirationTime = 1234124321413242

    link = await createLink(tokenAddress, claimAmount, expirationTime)

    expect(
      await linkdropInstance.verifySenderSignature(
        tokenAddress,
        claimAmount,
        expirationTime,
        link.linkId,
        link.senderSignature
      )
    ).to.be.true
  })

  it('signs receiver address with link key and verifies this signature onchain', async () => {
    link = await createLink(tokenAddress, claimAmount, expirationTime)

    receiverAddress = ethers.Wallet.createRandom().address
    receiverSignature = await signReceiverAddress(link.linkKey, receiverAddress)

    expect(
      await linkdropInstance.verifyReceiverSignature(
        link.linkId,
        receiverAddress,
        receiverSignature
      )
    ).to.be.true
  })

  it('should fail to claim tokens when paused', async () => {
    link = await createLink(tokenAddress, claimAmount, expirationTime)

    receiverAddress = ethers.Wallet.createRandom().address
    receiverSignature = await signReceiverAddress(link.linkKey, receiverAddress)

    await linkdropInstance.pause() // Pausing contract

    await expect(
      linkdropInstance.claim(
        tokenAddress,
        claimAmount,
        expirationTime,
        link.linkId,
        link.senderSignature,
        receiverAddress,
        receiverSignature,
        { gasLimit: 80000 }
      )
    ).to.be.reverted
  })

  it('should fail to claim more than approved amount of tokens', async () => {
    await linkdropInstance.unpause() // Unpausing

    link = await createLink(tokenAddress, claimAmount, expirationTime)
    receiverAddress = ethers.Wallet.createRandom().address
    receiverSignature = await signReceiverAddress(link.linkKey, receiverAddress)
    await expect(
      linkdropInstance.claim(
        tokenAddress,
        claimAmount,
        expirationTime,
        link.linkId,
        link.senderSignature,
        receiverAddress,
        receiverSignature,
        { gasLimit: 500000 }
      )
    ).to.be.reverted
  })

  it('should fail to claim tokens by expired link', async () => {
    // Approving tokens from sender to Linkdrop Contract
    await tokenInstance.approve(linkdropInstance.address, 100000)

    link = await createLink(tokenAddress, claimAmount, 0)
    receiverAddress = ethers.Wallet.createRandom().address
    receiverSignature = await signReceiverAddress(link.linkKey, receiverAddress)

    await expect(
      linkdropInstance.claim(
        tokenAddress,
        claimAmount,
        0,
        link.linkId,
        link.senderSignature,
        receiverAddress,
        receiverSignature,
        { gasLimit: 500000 }
      )
    ).to.be.revertedWith('Link has expired')
  })

  it('should succesfully claim tokens with valid claim params', async () => {
    // Approving tokens from sender to Linkdrop Contract
    await tokenInstance.approve(linkdropInstance.address, 100000)

    link = await createLink(tokenAddress, claimAmount, expirationTime)
    receiverAddress = ethers.Wallet.createRandom().address
    receiverSignature = await signReceiverAddress(link.linkKey, receiverAddress)

    await expect(
      linkdropInstance.claim(
        tokenAddress,
        claimAmount,
        expirationTime,
        link.linkId,
        link.senderSignature,
        receiverAddress,
        receiverSignature,
        { gasLimit: 500000 }
      )
    )
      .to.emit(linkdropInstance, 'Claimed')
      .to.emit(tokenInstance, 'Transfer') // should transfer claimed tokens to receiver
      .withArgs(sender.address, receiverAddress, claimAmount)

    let receiverTokenBalance = await tokenInstance.balanceOf(receiverAddress)
    expect(receiverTokenBalance).to.eq(claimAmount)
  })

  it('should fail to claim link twice', async () => {
    await expect(
      linkdropInstance.claim(
        tokenAddress,
        claimAmount,
        expirationTime,
        link.linkId,
        link.senderSignature,
        receiverAddress,
        receiverSignature,
        { gasLimit: 500000 }
      )
    ).to.be.revertedWith('Link has already been claimed')
  })

  it('should fail to claim tokens with fake verification signature', async () => {
    let wallet = ethers.Wallet.createRandom()
    let linkId = wallet.address

    let message = ethers.utils.solidityKeccak256(['address'], [linkId])
    let messageToSign = ethers.utils.arrayify(message)
    let fakeSignature = await receiver.signMessage(messageToSign)

    await expect(
      linkdropInstance.claim(
        tokenAddress,
        claimAmount,
        expirationTime,
        linkId,
        fakeSignature,
        receiverAddress,
        receiverSignature,
        { gasLimit: 500000 }
      )
    ).to.be.revertedWith('Link key is not signed by sender verification key')
  })

  it('should fail to claim tokens with fake receiver signature', async () => {
    link = await createLink(tokenAddress, claimAmount, expirationTime)
    let fakeLink = await createLink(tokenAddress, claimAmount, expirationTime)
    receiverAddress = ethers.Wallet.createRandom().address
    receiverSignature = await signReceiverAddress(
      fakeLink.linkKey, // signing receiver address with fake link key
      receiverAddress
    )
    await expect(
      linkdropInstance.claim(
        tokenAddress,
        claimAmount,
        expirationTime,
        link.linkId,
        link.senderSignature,
        receiverAddress,
        receiverSignature,
        { gasLimit: 500000 }
      )
    ).to.be.revertedWith('Receiver address is not signed by link key')
  })

  it('should fail to claim tokens by canceled link', async () => {
    link = await createLink(tokenAddress, claimAmount, expirationTime)
    receiverAddress = ethers.Wallet.createRandom().address
    receiverSignature = await signReceiverAddress(link.linkKey, receiverAddress)

    await linkdropInstance.cancel(link.linkId)

    await expect(
      linkdropInstance.claim(
        tokenAddress,
        claimAmount,
        expirationTime,
        link.linkId,
        link.senderSignature,
        receiverAddress,
        receiverSignature,
        { gasLimit: 500000 }
      )
    ).to.be.revertedWith('Link has been canceled')
  })

  it('should succesully claim ethers', async () => {
    claimAmount = 100 // wei
    link = await createLink(
      ethers.constants.AddressZero,
      claimAmount,
      expirationTime
    )
    receiverAddress = ethers.Wallet.createRandom().address
    receiverSignature = await signReceiverAddress(link.linkKey, receiverAddress)

    // send some eth
    let tx = {
      to: linkdropInstance.address,
      value: ethers.utils.parseEther('0.5')
    }
    await sender.sendTransaction(tx)

    await expect(
      linkdropInstance.claim(
        ethers.constants.AddressZero,
        claimAmount,
        expirationTime,
        link.linkId,
        link.senderSignature,
        receiverAddress,
        receiverSignature,
        { gasLimit: 500000 }
      )
    ).to.emit(linkdropInstance, 'Claimed')
  })

  /// ////////////////////////              ERC721             ///////////////////////////

  it('creates new link key and verifies its signature', async () => {
    tokenAddress = nftInstance.address
    let tokenId = 0
    link = await createLinkERC721(tokenAddress, tokenId, expirationTime)

    receiverAddress = ethers.Wallet.createRandom().address
    receiverSignature = await signReceiverAddress(link.linkKey, receiverAddress)

    expect(
      await linkdropInstance.verifySenderSignature(
        tokenAddress,
        tokenId,
        expirationTime,
        link.linkId,
        link.senderSignature
      )
    ).to.be.true
  })

  it('should fail to claim non approved NFT', async () => {
    let tokenId = 0

    link = await createLinkERC721(tokenAddress, tokenId, expirationTime)
    receiverAddress = ethers.Wallet.createRandom().address
    receiverSignature = await signReceiverAddress(link.linkKey, receiverAddress)

    await expect(
      linkdropInstance.claimERC721(
        tokenAddress,
        tokenId, // NFT with this id is not approved yet
        expirationTime,
        link.linkId,
        link.senderSignature,
        receiverAddress,
        receiverSignature,
        { gasLimit: 500000 }
      )
    ).to.be.reverted
  })

  it('should succesfully claim NFT with valid claim params', async () => {
    let tokenId = 0
    // Approving NFT with tokenID = 0 from linkdropper to Linkdrop Contract
    await nftInstance.approve(linkdropInstance.address, tokenId)

    link = await createLinkERC721(tokenAddress, tokenId, expirationTime)
    receiverAddress = ethers.Wallet.createRandom().address
    receiverSignature = await signReceiverAddress(link.linkKey, receiverAddress)

    await expect(
      linkdropInstance.claimERC721(
        tokenAddress,
        tokenId, // NFT with this id is not approved yet
        expirationTime,
        link.linkId,
        link.senderSignature,
        receiverAddress,
        receiverSignature,
        { gasLimit: 500000 }
      )
    )
      .to.emit(linkdropInstance, 'Claimed')
      .to.emit(nftInstance, 'Transfer') // should transfer claimed NFT
      .withArgs(sender.address, receiverAddress, tokenId)
  })

  it('should fail to claim NFT with already claimed tokenId', async () => {
    let tokenId = 0
    link = await createLinkERC721(tokenAddress, tokenId, expirationTime)
    receiverAddress = ethers.Wallet.createRandom().address
    receiverSignature = await signReceiverAddress(link.linkKey, receiverAddress)

    await expect(
      linkdropInstance.claimERC721(
        tokenAddress,
        tokenId, // NFT with this id is not approved yet
        expirationTime,
        link.linkId,
        link.senderSignature,
        receiverAddress,
        receiverSignature,
        { gasLimit: 500000 }
      )
    ).to.be.reverted
  })
})
