/* global describe, before, it */

import chai from 'chai'

import {
  createMockProvider,
  deployContract,
  getWallets,
  solidity
} from 'ethereum-waffle'

import LinkdropFactory from '../build/LinkdropFactory'
import LinkdropMastercopy from '../build/LinkdropMastercopy'
import NFTMock from '../build/NFTMock'

import {
  computeProxyAddress,
  createLink,
  signReceiverAddress,
  computeBytecode
} from '../scripts/utils'

const ethers = require('ethers')

// Turn off annoying warnings
ethers.errors.setLogLevel('error')

chai.use(solidity)
const { expect } = chai

let provider = createMockProvider()

let [linkdropMaster, receiver, nonsender, linkdropSigner] = getWallets(provider)

let masterCopy
let factory
let proxy
let proxyAddress
let nftInstance

let link
let receiverAddress
let receiverSignature
let weiAmount
let nftAddress
let tokenId
let expirationTime
let version
let bytecode

const initcode = '0x6352c7420d6000526103ff60206004601c335afa6040516060f3'
const chainId = 4 // Rinkeby

describe('ETH/ERC721 linkdrop tests (approve pattern)', () => {
  before(async () => {
    nftInstance = await deployContract(linkdropMaster, NFTMock)
  })

  it('should deploy master copy of linkdrop implementation', async () => {
    masterCopy = await deployContract(linkdropMaster, LinkdropMastercopy, [], {
      gasLimit: 6000000
    })
    expect(masterCopy.address).to.not.eq(ethers.constants.AddressZero)
  })

  it('should deploy factory', async () => {
    bytecode = computeBytecode(masterCopy.address)
    factory = await deployContract(
      linkdropMaster,
      LinkdropFactory,
      [masterCopy.address, chainId],
      {
        gasLimit: 6000000
      }
    )
    expect(factory.address).to.not.eq(ethers.constants.AddressZero)
    let version = await factory.masterCopyVersion()
    expect(version).to.eq(1)
  })

  it('should deploy proxy and delegate to implementation', async () => {
    // Compute next address with js function
    proxyAddress = computeProxyAddress(
      factory.address,
      linkdropMaster.address,
      initcode
    )

    await expect(
      factory.deployProxy({
        gasLimit: 6000000
      })
    ).to.emit(factory, 'Deployed')

    proxy = new ethers.Contract(
      proxyAddress,
      LinkdropMastercopy.abi,
      linkdropMaster
    )

    let linkdropMasterAddress = await proxy.linkdropMaster()
    expect(linkdropMasterAddress).to.eq(linkdropMaster.address)

    let version = await proxy.version()
    expect(version).to.eq(1)

    let owner = await proxy.owner()
    expect(owner).to.eq(factory.address)
  })

  it('linkdropMaster should be able to add new signing keys', async () => {
    let isSigner = await proxy.isLinkdropSigner(linkdropSigner.address)
    expect(isSigner).to.eq(false)
    await proxy.addSigner(linkdropSigner.address, { gasLimit: 500000 })
    isSigner = await proxy.isLinkdropSigner(linkdropSigner.address)
    expect(isSigner).to.eq(true)

    await proxy.addSigner(receiver.address, { gasLimit: 500000 })
  })

  it('non linkdropMaster should not be able to remove signing key', async () => {
    let proxyInstance = new ethers.Contract(
      proxyAddress,
      LinkdropMastercopy.abi,
      nonsender
    )

    let isSigner = await proxyInstance.isLinkdropSigner(receiver.address)
    expect(isSigner).to.eq(true)

    await expect(
      proxyInstance.removeSigner(receiver.address, { gasLimit: 500000 })
    ).to.be.revertedWith('Only linkdrop master')
    isSigner = await proxyInstance.isLinkdropSigner(receiver.address)
    expect(isSigner).to.eq(true)
  })

  it('linkdropMaster should be able to remove signing key', async () => {
    let isSigner = await proxy.isLinkdropSigner(receiver.address)
    expect(isSigner).to.eq(true)

    await proxy.removeSigner(receiver.address, { gasLimit: 500000 })

    isSigner = await proxy.isLinkdropSigner(receiver.address)
    expect(isSigner).to.eq(false)
  })

  it('should revert while checking claim params with unavailable token', async () => {
    weiAmount = 0
    nftAddress = nftInstance.address
    tokenId = 1
    expirationTime = 11234234223
    version = 1

    link = await createLink(
      linkdropSigner,
      weiAmount,
      nftAddress,
      tokenId,
      expirationTime,
      version,
      chainId
    )
    receiverAddress = ethers.Wallet.createRandom().address
    receiverSignature = await signReceiverAddress(link.linkKey, receiverAddress)

    await expect(
      factory.checkClaimParamsERC721(
        weiAmount,
        nftAddress,
        tokenId,
        expirationTime,
        link.linkId,
        linkdropMaster.address,
        link.linkdropSignerSignature,
        receiverAddress,
        receiverSignature,
        proxyAddress
      )
    ).to.be.revertedWith('Unavailable token')
  })

  it('creates new link key and verifies its signature', async () => {
    let senderAddress = linkdropMaster.address

    let senderAddr = await proxy.linkdropMaster()
    expect(senderAddress).to.eq(senderAddr)

    link = await createLink(
      linkdropSigner,
      weiAmount,
      nftAddress,
      tokenId,
      expirationTime,
      version,
      chainId
    )

    expect(
      await proxy.verifyLinkdropSignerSignatureERC721(
        weiAmount,
        nftAddress,
        tokenId,
        expirationTime,
        version,
        chainId,
        link.linkId,
        link.linkdropSignerSignature
      )
    ).to.be.true
  })

  it('signs receiver address with link key and verifies this signature onchain', async () => {
    link = await createLink(
      linkdropSigner,
      weiAmount,
      nftAddress,
      tokenId,
      expirationTime,
      version,
      chainId
    )

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

  it('non-linkdropMaster should not be able to pause contract', async () => {
    let proxyInstance = new ethers.Contract(
      proxyAddress,
      LinkdropMastercopy.abi,
      nonsender
    )
    // Pausing
    await expect(proxyInstance.pause({ gasLimit: 500000 })).to.be.revertedWith(
      'Only linkdrop master'
    )
  })

  it('linkdropMaster should be able to pause contract', async () => {
    // Pausing
    await proxy.pause({ gasLimit: 500000 })
    let paused = await proxy.paused()
    expect(paused).to.eq(true)
  })

  it('linkdropMaster should be able to unpause contract', async () => {
    // Unpausing
    await proxy.unpause({ gasLimit: 500000 })
    let paused = await proxy.paused()
    expect(paused).to.eq(false)
  })

  it('linkdropMaster should be able to cancel link', async () => {
    link = await createLink(
      linkdropSigner,
      weiAmount,
      nftAddress,
      tokenId,
      expirationTime,
      version,
      chainId
    )
    await expect(proxy.cancel(link.linkId, { gasLimit: 200000 })).to.emit(
      proxy,
      'Canceled'
    )
    let canceled = await proxy.isCanceledLink(link.linkId)
    expect(canceled).to.eq(true)
  })

  it('should fail to claim nft when paused', async () => {
    link = await createLink(
      linkdropSigner,
      weiAmount,
      nftAddress,
      tokenId,
      expirationTime,
      version,
      chainId
    )

    receiverAddress = ethers.Wallet.createRandom().address
    receiverSignature = await signReceiverAddress(link.linkKey, receiverAddress)

    // Pausing
    await proxy.pause({ gasLimit: 500000 })

    await expect(
      factory.claimERC721Approve(
        weiAmount,
        nftAddress,
        tokenId,
        expirationTime,
        link.linkId,
        linkdropMaster.address,
        link.linkdropSignerSignature,
        receiverAddress,
        receiverSignature,
        { gasLimit: 500000 }
      )
    ).to.be.reverted
  })

  it('should fail to claim nft not owned by proxy', async () => {
    // Unpause
    await proxy.unpause({ gasLimit: 500000 })

    link = await createLink(
      linkdropSigner,
      weiAmount,
      nftAddress,
      tokenId,
      expirationTime,
      version,
      chainId
    )
    receiverAddress = ethers.Wallet.createRandom().address
    receiverSignature = await signReceiverAddress(link.linkKey, receiverAddress)

    await expect(
      factory.claimERC721Approve(
        weiAmount,
        nftAddress,
        tokenId,
        expirationTime,
        link.linkId,
        linkdropMaster.address,
        link.linkdropSignerSignature,
        receiverAddress,
        receiverSignature,
        { gasLimit: 500000 }
      )
    ).to.be.reverted
  })

  it('should fail to claim unavailable token', async () => {
    link = await createLink(
      linkdropSigner,
      weiAmount,
      nftAddress,
      tokenId,
      expirationTime,
      version,
      chainId
    )
    receiverAddress = ethers.Wallet.createRandom().address
    receiverSignature = await signReceiverAddress(link.linkKey, receiverAddress)

    await expect(
      factory.claimERC721Approve(
        weiAmount,
        nftAddress,
        tokenId,
        expirationTime,
        link.linkId,
        linkdropMaster.address,
        link.linkdropSignerSignature,
        receiverAddress,
        receiverSignature,
        { gasLimit: 500000 }
      )
    ).to.be.revertedWith('Unavailable token')
  })

  it('should fail to claim nft by expired link', async () => {
    // Approving all tokens from linkdropMaster to Linkdrop Contract
    await nftInstance.setApprovalForAll(proxy.address, true)

    link = await createLink(
      linkdropSigner,
      weiAmount,
      nftAddress,
      tokenId,
      0,
      version,
      chainId
    )
    receiverAddress = ethers.Wallet.createRandom().address
    receiverSignature = await signReceiverAddress(link.linkKey, receiverAddress)

    await expect(
      factory.claimERC721Approve(
        weiAmount,
        nftAddress,
        tokenId,
        0,
        link.linkId,
        linkdropMaster.address,
        link.linkdropSignerSignature,
        receiverAddress,
        receiverSignature,
        { gasLimit: 500000 }
      )
    ).to.be.revertedWith('Expired link')
  })

  it('should fail to claim nft with invalid contract version link', async () => {
    let invalidVersion = 0
    link = await createLink(
      linkdropSigner,
      weiAmount,
      nftAddress,
      tokenId,
      expirationTime,
      invalidVersion,
      chainId
    )
    receiverAddress = ethers.Wallet.createRandom().address
    receiverSignature = await signReceiverAddress(link.linkKey, receiverAddress)

    await expect(
      factory.claimERC721Approve(
        weiAmount,
        nftAddress,
        tokenId,
        expirationTime,
        link.linkId,
        linkdropMaster.address,
        link.linkdropSignerSignature,
        receiverAddress,
        receiverSignature,
        { gasLimit: 500000 }
      )
    ).to.be.revertedWith('Invalid linkdrop signer signature')
  })

  it('should fail to claim nft with invalid chaind id', async () => {
    let invalidChainId = 0
    link = await createLink(
      linkdropSigner,
      weiAmount,
      nftAddress,
      tokenId,
      expirationTime,
      version,
      invalidChainId
    )
    receiverAddress = ethers.Wallet.createRandom().address
    receiverSignature = await signReceiverAddress(link.linkKey, receiverAddress)

    await expect(
      factory.claimERC721Approve(
        weiAmount,
        nftAddress,
        tokenId,
        expirationTime,
        link.linkId,
        linkdropMaster.address,
        link.linkdropSignerSignature,
        receiverAddress,
        receiverSignature,
        { gasLimit: 500000 }
      )
    ).to.be.revertedWith('Invalid linkdrop signer signature')
  })

  it('should succesfully claim nft with valid claim params', async () => {
    link = await createLink(
      linkdropSigner,
      weiAmount,
      nftAddress,
      tokenId,
      expirationTime,
      version,
      chainId
    )

    receiverAddress = ethers.Wallet.createRandom().address
    receiverSignature = await signReceiverAddress(link.linkKey, receiverAddress)

    await factory.claimERC721Approve(
      weiAmount,
      nftAddress,
      tokenId,
      expirationTime,
      link.linkId,
      linkdropMaster.address,
      link.linkdropSignerSignature,
      receiverAddress,
      receiverSignature,
      { gasLimit: 800000 }
    )

    let owner = await nftInstance.ownerOf(tokenId)
    expect(owner).to.eq(receiverAddress)
  })

  it('should be able to check link claimed from factory instance', async () => {
    let claimed = await factory.isClaimedLink(
      linkdropMaster.address,
      link.linkId
    )
    expect(claimed).to.eq(true)
  })

  it('should fail to claim link twice', async () => {
    await expect(
      factory.claimERC721Approve(
        weiAmount,
        nftAddress,
        tokenId,
        expirationTime,
        link.linkId,
        linkdropMaster.address,
        link.linkdropSignerSignature,
        receiverAddress,
        receiverSignature,
        { gasLimit: 500000 }
      )
    ).to.be.revertedWith('Claimed link')
  })

  it('should fail to claim nft with fake linkdropMaster signature', async () => {
    tokenId = 2

    let wallet = ethers.Wallet.createRandom()
    let linkId = wallet.address

    let message = ethers.utils.solidityKeccak256(['address'], [linkId])
    let messageToSign = ethers.utils.arrayify(message)
    let fakeSignature = await receiver.signMessage(messageToSign)

    await expect(
      factory.claimERC721Approve(
        weiAmount,
        nftAddress,
        tokenId,
        expirationTime,
        linkId,
        linkdropMaster.address,
        fakeSignature,
        receiverAddress,
        receiverSignature,
        { gasLimit: 500000 }
      )
    ).to.be.revertedWith('Invalid linkdrop signer signature')
  })

  it('should fail to claim nft with fake receiver signature', async () => {
    link = await createLink(
      linkdropSigner,
      weiAmount,
      nftAddress,
      tokenId,
      expirationTime,
      version,
      chainId
    )

    let fakeLink = await createLink(
      linkdropSigner,
      weiAmount,
      nftAddress,
      tokenId,
      expirationTime,
      version,
      chainId
    )
    receiverAddress = ethers.Wallet.createRandom().address
    receiverSignature = await signReceiverAddress(
      fakeLink.linkKey, // signing receiver address with fake link key
      receiverAddress
    )
    await expect(
      factory.claimERC721Approve(
        weiAmount,
        nftAddress,
        tokenId,
        expirationTime,
        link.linkId,
        linkdropMaster.address,
        link.linkdropSignerSignature,
        receiverAddress,
        receiverSignature,
        { gasLimit: 500000 }
      )
    ).to.be.revertedWith('Invalid receiver signature')
  })

  it('should fail to claim nft by canceled link', async () => {
    link = await createLink(
      linkdropSigner,
      weiAmount,
      nftAddress,
      tokenId,
      expirationTime,
      version,
      chainId
    )
    receiverAddress = ethers.Wallet.createRandom().address
    receiverSignature = await signReceiverAddress(link.linkKey, receiverAddress)

    await proxy.cancel(link.linkId, { gasLimit: 100000 })

    await expect(
      factory.claimERC721Approve(
        weiAmount,
        nftAddress,
        tokenId,
        expirationTime,
        link.linkId,
        linkdropMaster.address,
        link.linkdropSignerSignature,
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
    await linkdropMaster.sendTransaction(tx)
    let balanceAfter = await provider.getBalance(proxy.address)
    expect(balanceAfter).to.eq(balanceBefore.add(wei))
  })

  it('should be able to withdraw ethers from proxy to linkdropMaster', async () => {
    let balanceBefore = await provider.getBalance(proxy.address)
    expect(balanceBefore).to.not.eq(0)
    await proxy.withdraw({ gasLimit: 200000 })
    let balanceAfter = await provider.getBalance(proxy.address)
    expect(balanceAfter).to.eq(0)
  })

  it('should succesfully claim nft and deploy proxy if not deployed yet', async () => {
    tokenId = 3

    nftAddress = nftInstance.address
    expirationTime = 11234234223
    version = 1

    proxyAddress = await computeProxyAddress(
      factory.address,
      linkdropMaster.address,
      initcode
    )

    // Contract not deployed yet
    proxy = new ethers.Contract(
      proxyAddress,
      LinkdropMastercopy.abi,
      linkdropMaster
    )

    link = await createLink(
      linkdropSigner,
      weiAmount,
      nftAddress,
      tokenId,
      expirationTime,
      version,
      chainId
    )

    receiverAddress = ethers.Wallet.createRandom().address
    receiverSignature = await signReceiverAddress(link.linkKey, receiverAddress)

    await expect(
      factory.claimERC721Approve(
        weiAmount,
        nftAddress,
        tokenId,
        expirationTime,
        link.linkId,
        linkdropMaster.address,
        link.linkdropSignerSignature,
        receiverAddress,
        receiverSignature,
        { gasLimit: 500000 }
      )
    )
      .to.emit(proxy, 'ClaimedERC721')
      .to.emit(nftInstance, 'Transfer')

    // Now when deployed, check linkdropMaster
    let senderAddr = await proxy.linkdropMaster()
    expect(linkdropMaster.address).to.eq(senderAddr)

    let owner = await nftInstance.ownerOf(tokenId)
    expect(owner).to.eq(receiverAddress)
  })

  it('should succesfully claim eth and nft simulteneously', async () => {
    tokenId = 4

    weiAmount = 15 // wei

    // Send ethers to Linkdrop contract
    let tx = {
      to: proxy.address,
      value: weiAmount
    }
    await linkdropMaster.sendTransaction(tx)

    link = await createLink(
      linkdropSigner,
      weiAmount,
      nftAddress,
      tokenId,
      expirationTime,
      version,
      chainId
    )

    receiverAddress = ethers.Wallet.createRandom().address
    receiverSignature = await signReceiverAddress(link.linkKey, receiverAddress)

    await factory.claimERC721Approve(
      weiAmount,
      nftAddress,
      tokenId,
      expirationTime,
      link.linkId,
      linkdropMaster.address,
      link.linkdropSignerSignature,
      receiverAddress,
      receiverSignature,
      { gasLimit: 800000 }
    )

    let owner = await nftInstance.ownerOf(tokenId)
    expect(owner).to.eq(receiverAddress)

    let receiverEthBalance = await provider.getBalance(receiverAddress)
    expect(receiverEthBalance).to.eq(weiAmount)
  })
})
