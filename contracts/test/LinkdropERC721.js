/* global describe, before, it */

import chai from 'chai'

import {
  createMockProvider,
  deployContract,
  getWallets,
  solidity
} from 'ethereum-waffle'

import NFTMock from '../build/NFTMock'
import LinkdropERC721 from '../build/LinkdropERC721'

const ethers = require('ethers')

chai.use(solidity)
const { expect } = chai

let provider = createMockProvider()

let [sender, receiver] = getWallets(provider)

let nftInstance
let linkdropInstance
let link
let receiverAddress
let receiverSignature
let tokenAddress
let tokenId
let expirationTime

// Should be signed by sender

const signLink = async function (tokenAddress, tokenId, expirationTime, linkId) {
  let messageHash = ethers.utils.solidityKeccak256(
    ['address', 'uint', 'uint', 'address'],
    [tokenAddress, tokenId, expirationTime, linkId]
  )
  let messageHashToSign = ethers.utils.arrayify(messageHash)
  let signature = await sender.signMessage(messageHashToSign)
  return signature
}

// Generates new link
const createLink = async function (tokenAddress, tokenId, expirationTime) {
  let linkWallet = ethers.Wallet.createRandom()
  let linkKey = linkWallet.privateKey
  let linkId = linkWallet.address
  let senderSignature = await signLink(
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

describe('Linkdrop ERC721 tests', () => {
  before(async () => {
    nftInstance = await deployContract(sender, NFTMock)

    linkdropInstance = await deployContract(
      sender,
      LinkdropERC721,
      [sender.address],
      { gasLimit: 5000000 }
    )
  })

  it('assigns owner of the contract as sender', async () => {
    expect(await linkdropInstance.SENDER()).to.eq(sender.address)
  })

  it('assigns initial token balance of sender', async () => {
    expect(await nftInstance.balanceOf(sender.address)).to.eq(100)
  })

  it('creates new link key and verifies its signature', async () => {
    tokenAddress = nftInstance.address
    tokenId = 0
    expirationTime = 11234234223

    link = await createLink(tokenAddress, tokenId, expirationTime)

    expect(
      await linkdropInstance.verifySenderSignatureERC721(
        tokenAddress,
        tokenId,
        expirationTime,
        link.linkId,
        link.senderSignature
      )
    ).to.be.true
  })

  it('signs receiver address with link key and verifies this signature onchain', async () => {
    link = await createLink(tokenAddress, tokenId, expirationTime)

    receiverAddress = ethers.Wallet.createRandom().address
    receiverSignature = await signReceiverAddress(link.linkKey, receiverAddress)

    expect(
      await linkdropInstance.verifyReceiverSignatureERC721(
        link.linkId,
        receiverAddress,
        receiverSignature
      )
    ).to.be.true
  })

  it('should fail to claim nft when paused', async () => {
    link = await createLink(tokenAddress, tokenId, expirationTime)

    receiverAddress = ethers.Wallet.createRandom().address
    receiverSignature = await signReceiverAddress(link.linkKey, receiverAddress)

    await linkdropInstance.pause() // Pausing contract

    await expect(
      linkdropInstance.claimERC721(
        tokenAddress,
        tokenId,
        expirationTime,
        link.linkId,
        link.senderSignature,
        receiverAddress,
        receiverSignature,
        { gasLimit: 80000 }
      )
    ).to.be.reverted
  })

  it('should fail to claim non approved NFT', async () => {
    await linkdropInstance.unpause() // Unpausing contract

    link = await createLink(tokenAddress, tokenId, expirationTime)
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

  it('should fail to claim tokens by expired link', async () => {
    tokenId = 1
    // Approving tokens from sender to Linkdrop Contract
    await nftInstance.approve(linkdropInstance.address, tokenId)

    link = await createLink(tokenAddress, tokenId, 0)
    receiverAddress = ethers.Wallet.createRandom().address
    receiverSignature = await signReceiverAddress(link.linkKey, receiverAddress)

    await expect(
      linkdropInstance.claimERC721(
        tokenAddress,
        tokenId,
        0,
        link.linkId,
        link.senderSignature,
        receiverAddress,
        receiverSignature,
        { gasLimit: 500000 }
      )
    ).to.be.revertedWith('Link has expired')
  })

  it('should succesfully claim NFT with valid claim params', async () => {
    tokenId = 2

    // Approving NFT with tokenID from linkdropper to Linkdrop Contract
    await nftInstance.approve(linkdropInstance.address, tokenId)

    link = await createLink(tokenAddress, tokenId, expirationTime)
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
    ).to.emit(linkdropInstance, 'Claimed')
    //   .to.emit(nftInstance, 'Transfer') // should transfer claimed NFT
    //   .withArgs(sender.address, receiverAddress, tokenId)
  })

  it('should fail to claim link twice', async () => {
    await expect(
      linkdropInstance.claimERC721(
        tokenAddress,
        tokenId,
        expirationTime,
        link.linkId,
        link.senderSignature,
        receiverAddress,
        receiverSignature,
        { gasLimit: 500000 }
      )
    ).to.be.revertedWith('Link has already been claimed')
  })

  it('should fail to claim NFT with already claimed tokenId', async () => {
    link = await createLink(tokenAddress, tokenId, expirationTime)
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

  it('should fail to claim NFT with fake sender signature', async () => {
    let wallet = ethers.Wallet.createRandom()
    let linkId = wallet.address

    let message = ethers.utils.solidityKeccak256(['address'], [linkId])
    let messageToSign = ethers.utils.arrayify(message)
    let fakeSignature = await receiver.signMessage(messageToSign)

    await expect(
      linkdropInstance.claimERC721(
        tokenAddress,
        tokenId,
        expirationTime,
        linkId,
        fakeSignature,
        receiverAddress,
        receiverSignature,
        { gasLimit: 500000 }
      )
    ).to.be.revertedWith('Link key is not signed by sender verification key')
  })

  it('should fail to claim NFT with fake receiver signature', async () => {
    link = await createLink(tokenAddress, tokenId, expirationTime)
    let fakeLink = await createLink(tokenAddress, tokenId, expirationTime)
    receiverAddress = ethers.Wallet.createRandom().address
    receiverSignature = await signReceiverAddress(
      fakeLink.linkKey, // signing receiver address with fake link key
      receiverAddress
    )
    await expect(
      linkdropInstance.claimERC721(
        tokenAddress,
        tokenId,
        expirationTime,
        link.linkId,
        link.senderSignature,
        receiverAddress,
        receiverSignature,
        { gasLimit: 500000 }
      )
    ).to.be.revertedWith('Receiver address is not signed by link key')
  })

  it('should fail to claim NFT by canceled link', async () => {
    link = await createLink(tokenAddress, tokenId, expirationTime)
    receiverAddress = ethers.Wallet.createRandom().address
    receiverSignature = await signReceiverAddress(link.linkKey, receiverAddress)

    await linkdropInstance.cancel(link.linkId)

    await expect(
      linkdropInstance.claimERC721(
        tokenAddress,
        tokenId,
        expirationTime,
        link.linkId,
        link.senderSignature,
        receiverAddress,
        receiverSignature,
        { gasLimit: 500000 }
      )
    ).to.be.revertedWith('Link has been canceled')
  })
})
