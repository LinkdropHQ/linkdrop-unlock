/* global describe, before, it */

import chai from 'chai'

import {
  createMockProvider,
  deployContract,
  getWallets,
  solidity
} from 'ethereum-waffle'

import Factory from '../build/Factory'
import LinkdropERC721 from '../build/LinkdropERC721'
import NFTMock from '../build/NFTMock'

import {
  computeProxyAddress,
  createLink,
  signReceiverAddress
} from '../scripts/utils'

const ethers = require('ethers')

chai.use(solidity)
const { expect } = chai

let provider = createMockProvider()

let [sender, receiver, nonsender] = getWallets(provider)

let masterCopy
let factory
let proxy
let proxyAddress
let nftInstance

let link
let receiverAddress
let receiverSignature
let nftAddress
let tokenId
let expirationTime

describe('Linkdrop ERC721 tests', () => {
  before(async () => {
    nftInstance = await deployContract(sender, NFTMock)
  })

  it('should deploy master copy of linkdrop implementation', async () => {
    masterCopy = await deployContract(sender, LinkdropERC721)
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

    proxy = new ethers.Contract(proxyAddress, LinkdropERC721.abi, sender)

    let senderAddr = await proxy.SENDER()
    expect(senderAddress).to.eq(senderAddr)
  })

  it('creates new link key and verifies its signature', async () => {
    nftAddress = nftInstance.address
    tokenId = 1
    expirationTime = 11234234223

    let senderAddress = sender.address

    let senderAddr = await proxy.SENDER()
    expect(senderAddress).to.eq(senderAddr)

    link = await createLink(sender, nftAddress, tokenId, expirationTime)

    expect(
      await proxy.verifySenderSignatureERC721(
        nftAddress,
        tokenId,
        expirationTime,
        link.linkId,
        link.senderSignature
      )
    ).to.be.true
  })

  it('signs receiver address with link key and verifies this signature onchain', async () => {
    link = await createLink(sender, nftAddress, tokenId, expirationTime)

    receiverAddress = ethers.Wallet.createRandom().address
    receiverSignature = await signReceiverAddress(link.linkKey, receiverAddress)

    expect(
      await proxy.verifyReceiverSignatureERC721(
        link.linkId,
        receiverAddress,
        receiverSignature
      )
    ).to.be.true
  })

  it('non-sender should not be able to pause contract', async () => {
    let proxyInstance = new ethers.Contract(
      proxyAddress,
      LinkdropERC721.abi,
      nonsender
    )
    // Pausing
    await expect(proxyInstance.pause({ gasLimit: 500000 })).to.be.revertedWith(
      'Only sender'
    )
  })

  it('sender should be able to pause contract', async () => {
    // Pausing
    await proxy.pause({ gasLimit: 500000 })
    let paused = await proxy.paused()
    expect(paused).to.eq(true)
  })

  it('sender should be able to unpause contract', async () => {
    // Unpausing
    await proxy.unpause({ gasLimit: 500000 })
    let paused = await proxy.paused()
    expect(paused).to.eq(false)
  })

  it('sender should be able to cancel link', async () => {
    link = await createLink(sender, nftAddress, tokenId, expirationTime)
    await expect(proxy.cancel(link.linkId, { gasLimit: 200000 })).to.emit(
      proxy,
      'Canceled'
    )
    let canceled = await proxy.isCanceledLink(link.linkId)
    expect(canceled).to.eq(true)
  })

  it('should fail to claim nft when paused', async () => {
    link = await createLink(sender, nftAddress, tokenId, expirationTime)

    receiverAddress = ethers.Wallet.createRandom().address
    receiverSignature = await signReceiverAddress(link.linkKey, receiverAddress)

    // Pausing
    await proxy.pause({ gasLimit: 500000 })

    await expect(
      factory.claimERC721(
        nftAddress,
        tokenId,
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

  it('should fail to claim nft not owned by proxy', async () => {
    // Unpause
    await proxy.unpause({ gasLimit: 500000 })

    link = await createLink(sender, nftAddress, tokenId, expirationTime)
    receiverAddress = ethers.Wallet.createRandom().address
    receiverSignature = await signReceiverAddress(link.linkKey, receiverAddress)

    await expect(
      factory.claimERC721(
        nftAddress,
        tokenId,
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

  it('should fail to claim nft by expired link', async () => {
    // Approving nft from sender to Linkdrop Contract
    await nftInstance.approve(proxy.address, tokenId)

    let available = await proxy.isAvailableToken(nftInstance.address, tokenId)
    expect(available).to.eq(true)

    link = await createLink(sender, nftAddress, tokenId, 0)
    receiverAddress = ethers.Wallet.createRandom().address
    receiverSignature = await signReceiverAddress(link.linkKey, receiverAddress)

    await expect(
      factory.claimERC721(
        nftAddress,
        tokenId,
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

  it('should succesfully claim nft with valid claim params', async () => {
    link = await createLink(sender, nftAddress, tokenId, expirationTime)

    receiverAddress = ethers.Wallet.createRandom().address
    receiverSignature = await signReceiverAddress(link.linkKey, receiverAddress)

    await factory.claimERC721(
      nftAddress,
      tokenId,
      expirationTime,
      link.linkId,
      sender.address,
      link.senderSignature,
      receiverAddress,
      receiverSignature,
      { gasLimit: 800000 }
    )

    let owner = await nftInstance.ownerOf(tokenId)
    expect(owner).to.eq(receiverAddress)
  })

  it('should fail to claim link twice', async () => {
    await expect(
      factory.claimERC721(
        nftAddress,
        tokenId,
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

  it('should fail to claim nft with fake sender signature', async () => {
    let wallet = ethers.Wallet.createRandom()
    let linkId = wallet.address

    let message = ethers.utils.solidityKeccak256(['address'], [linkId])
    let messageToSign = ethers.utils.arrayify(message)
    let fakeSignature = await receiver.signMessage(messageToSign)

    await expect(
      factory.claimERC721(
        nftAddress,
        tokenId,
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

  it('should fail to claim nft with fake receiver signature', async () => {
    link = await createLink(sender, nftAddress, tokenId, expirationTime)

    let fakeLink = await createLink(sender, nftAddress, tokenId, expirationTime)
    receiverAddress = ethers.Wallet.createRandom().address
    receiverSignature = await signReceiverAddress(
      fakeLink.linkKey, // signing receiver address with fake link key
      receiverAddress
    )
    await expect(
      factory.claimERC721(
        nftAddress,
        tokenId,
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

  it('should fail to claim nft by canceled link', async () => {
    link = await createLink(sender, nftAddress, tokenId, expirationTime)
    receiverAddress = ethers.Wallet.createRandom().address
    receiverSignature = await signReceiverAddress(link.linkKey, receiverAddress)

    await proxy.cancel(link.linkId, { gasLimit: 100000 })

    await expect(
      factory.claimERC721(
        nftAddress,
        tokenId,
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

  it('should be able to send ethers to proxy', async () => {
    let balanceBefore = await provider.getBalance(proxy.address)

    let wei = ethers.utils.parseEther('2')
    // send some eth
    let tx = {
      to: proxy.address,
      value: wei
    }
    await sender.sendTransaction(tx)
    let balanceAfter = await provider.getBalance(proxy.address)
    expect(balanceAfter).to.eq(balanceBefore.add(wei))
  })

  it('should be able to withdraw ethers from proxy to sender', async () => {
    let balanceBefore = await provider.getBalance(proxy.address)
    expect(balanceBefore).to.not.eq(0)
    await proxy.withdraw({ gasLimit: 200000 })
    let balanceAfter = await provider.getBalance(proxy.address)
    expect(balanceAfter).to.eq(0)
  })

  it('should succesfully claim nft and deploy proxy is not deployed yet', async () => {
    nftAddress = nftInstance.address
    tokenId = 2
    expirationTime = 11234234223

    proxyAddress = await computeProxyAddress(
      factory.address,
      sender.address,
      masterCopy.address
    )

    // Transfering nft from sender to Linkdrop Contract
    await nftInstance.transferFrom(sender.address, proxyAddress, tokenId)

    // Contract not deployed yet
    proxy = new ethers.Contract(proxyAddress, LinkdropERC721.abi, sender)

    link = await createLink(sender, nftAddress, tokenId, expirationTime)

    receiverAddress = ethers.Wallet.createRandom().address
    receiverSignature = await signReceiverAddress(link.linkKey, receiverAddress)

    await expect(
      factory.claimERC721(
        nftAddress,
        tokenId,
        expirationTime,
        link.linkId,
        sender.address,
        link.senderSignature,
        receiverAddress,
        receiverSignature,
        { gasLimit: 500000 }
      )
    )
      .to.emit(proxy, 'Claimed')
      .to.emit(nftInstance, 'Transfer')

    // Now when deployed, check sender
    let senderAddr = await proxy.SENDER()
    expect(sender.address).to.eq(senderAddr)

    let owner = await nftInstance.ownerOf(tokenId)
    expect(owner).to.eq(receiverAddress)
  })
})
