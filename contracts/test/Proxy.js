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

let [sender, receiver, user] = getWallets(provider)

let masterCopy
let factory
let proxy

const bytecode = `0x${Proxy.bytecode}`

describe('Factory - Proxy pattern tests', () => {
  //   before(async () => {})

  it('should deploy master copy of linkdrop implementation', async () => {
    masterCopy = await deployContract(sender, Linkdrop)
  })

  it('should deploy factory', async () => {
    factory = await deployContract(
      sender,
      Factory,
      [bytecode, masterCopy.address],
      {
        gasLimit: 6000000
      }
    )

    expect(factory.address).to.not.eq(ethers.constants.AddressZero)
  })

  it('should deploy proxy and delegate to implementation', async () => {
    let senderAddress = sender.address

    // Compute next address with js function
    let expectedAddress = await computeProxyAddress(
      factory.address,
      senderAddress
    )

    await factory.deployProxy(senderAddress)

    let contractsDeployed = await factory.contractsDeployed()
    let deployedAddress = await factory.proxies(contractsDeployed)
    proxy = new ethers.Contract(deployedAddress, Wrapper.abi, sender)

    let implementation = await proxy.implementation()
    expect(implementation).to.eq(masterCopy.address)

    let senderAddr = await proxy.SENDER()
    expect(senderAddress).to.eq(senderAddr)

    let ownerAddress = await proxy.owner()
    expect(ownerAddress).to.eq(factory.address)
  })

  it('should correctly precompute create2 address', async () => {
    let senderAddress = receiver.address
    let expectedAddress = await computeProxyAddress(
      factory.address,
      senderAddress
    )

    await factory.deployProxy(senderAddress)

    let contractsDeployed = await factory.contractsDeployed()

    let deployedAddress = await factory.proxies(contractsDeployed)

    proxy = new ethers.Contract(deployedAddress, Wrapper.abi, sender)

    expect(expectedAddress.toString().toLowerCase()).to.be.equal(
      deployedAddress.toString().toLowerCase()
    )
  })

  it('should deploy another proxy', async () => {
    let senderAddress = user.address
    let expectedAddress = await computeProxyAddress(
      factory.address,
      senderAddress
    )
    await factory.deployProxy(senderAddress)

    let contractsDeployed = await factory.contractsDeployed()
    let proxyAddress = await factory.proxies(contractsDeployed)
    expect(proxyAddress.toString().toLowerCase()).to.eq(
      expectedAddress.toString().toLowerCase()
    )
  })
})
