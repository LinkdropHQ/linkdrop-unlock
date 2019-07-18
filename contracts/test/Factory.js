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
import TokenMock from '../build/TokenMock'
import Registry from '../build/Registry'

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

let [linkdropMaster, linkdropSigner, relayer] = getWallets(provider)

let masterCopy
let factory
let proxy
let proxyAddress
let tokenInstance
let registry

let link
let receiverAddress
let receiverSignature
let weiAmount
let tokenAddress
let tokenAmount
let expirationTime
let version
let bytecode

const campaignId = 0

const initcode = '0x6352c7420d6000526103ff60206004601c335afa6040516060f3'
const chainId = 4 // Rinkeby

describe('Factory tests', () => {
  before(async () => {
    tokenInstance = await deployContract(linkdropMaster, TokenMock)
    registry = await deployContract(linkdropMaster, Registry)
    await registry.addRelayer(relayer.address)
    const isWhitelisted = await registry.isWhitelistedRelayer(relayer.address)
    expect(isWhitelisted).to.be.true
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
      [masterCopy.address, chainId, registry.address],
      {
        gasLimit: 6000000
      }
    )

    expect(factory.address).to.not.eq(ethers.constants.AddressZero)
    let version = await factory.masterCopyVersion()
    expect(version).to.eq(1)
  })

  it('should deploy proxy with signing key and topup with ethers in single tx', async () => {
    // Compute next address with js function
    let expectedAddress = computeProxyAddress(
      factory.address,
      linkdropMaster.address,
      campaignId,
      initcode
    )

    const value = 100 // wei

    await expect(
      factory.deployProxyWithSigner(campaignId, linkdropSigner.address, {
        value,
        gasLimit: 6000000
      })
    ).to.emit(factory, 'Deployed')

    proxy = new ethers.Contract(
      expectedAddress,
      LinkdropMastercopy.abi,
      linkdropMaster
    )

    let linkdropMasterAddress = await proxy.linkdropMaster()
    expect(linkdropMasterAddress).to.eq(linkdropMaster.address)

    let version = await proxy.version()
    expect(version).to.eq(1)

    let owner = await proxy.owner()
    expect(owner).to.eq(factory.address)

    let isSigner = await proxy.isLinkdropSigner(linkdropSigner.address)
    expect(isSigner).to.eq(true)

    const balance = await provider.getBalance(proxy.address)
    expect(balance).to.eq(value)
  })

  it('should change registry adress from factory owner account', async () => {
    const newRegistryAddress = ethers.Wallet.createRandom().address
    await factory.setRegistry(newRegistryAddress)
    const registryAddress = await factory.registry()
    expect(registryAddress).to.eq(newRegistryAddress)
  })
})
