/* global describe, it */

import chai from 'chai'

import {
  createMockProvider,
  deployContract,
  getWallets,
  solidity
} from 'ethereum-waffle'

import Factory from '../build/Factory'
import Linkdrop from '../build/Linkdrop'

import { computeProxyAddress } from '../scripts/utils'

const ethers = require('ethers')

chai.use(solidity)
const { expect } = chai

let provider = createMockProvider()

let [sender, receiver, user] = getWallets(provider)

let masterCopy
let factory
let proxy

describe('Factory and Proxy tests', () => {
  //   before(async () => {})

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
    let expectedAddress = await computeProxyAddress(
      factory.address,
      senderAddress,
      masterCopy.address
    )

    await factory.deployProxy(senderAddress)

    proxy = new ethers.Contract(expectedAddress, Linkdrop.abi, sender)

    let senderAddr = await proxy.sender()
    expect(senderAddress).to.eq(senderAddr)
  })

  it('should correctly precompute create2 address', async () => {
    let senderAddress = receiver.address
    let expectedAddress = await computeProxyAddress(
      factory.address,
      senderAddress,
      masterCopy.address
    )

    await factory.deployProxy(senderAddress)

    proxy = new ethers.Contract(expectedAddress, Linkdrop.abi, sender)

    let senderAddr = await proxy.sender()
    expect(senderAddress).to.eq(senderAddr)
  })

  it('should deploy another proxy', async () => {
    let senderAddress = user.address
    let expectedAddress = await computeProxyAddress(
      factory.address,
      senderAddress,
      masterCopy.address
    )

    await factory.deployProxy(senderAddress)

    proxy = new ethers.Contract(expectedAddress, Linkdrop.abi, sender)

    let senderAddr = await proxy.sender()
    expect(senderAddress).to.eq(senderAddr)
  })
})
