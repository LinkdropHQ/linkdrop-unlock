/* global describe, it */

import chai from 'chai'

import {
  createMockProvider,
  deployContract,
  getWallets,
  solidity
} from 'ethereum-waffle'

import LinkdropFactory from '../build/LinkdropFactory'
import LinkdropMastercopy from '../build/LinkdropMastercopy'

import { computeProxyAddress } from '../scripts/utils'

const ethers = require('ethers')

chai.use(solidity)
const { expect } = chai

let provider = createMockProvider()

let [linkdropMaster, receiver, user, deployer] = getWallets(provider)

let masterCopy
let factory
let proxy

describe('Factory/Proxy tests', () => {
  //   before(async () => {})

  it('should deploy master copy of linkdrop implementation', async () => {
    masterCopy = await deployContract(deployer, LinkdropMastercopy, [], {
      gasLimit: 6000000
    })
    expect(masterCopy.address).to.not.eq(ethers.constants.AddressZero)
  })

  it('should deploy factory', async () => {
    factory = await deployContract(
      deployer,
      LinkdropFactory,
      [masterCopy.address],
      {
        gasLimit: 6000000
      }
    )

    expect(factory.address).to.not.eq(ethers.constants.AddressZero)

    let version = await factory.version(masterCopy.address)
    expect(version).to.eq(1)
  })

  it('should deploy proxy and delegate to implementation', async () => {
    // Compute next address with js function
    let expectedAddress = await computeProxyAddress(
      factory.address,
      linkdropMaster.address,
      masterCopy.address
    )
    console.log('expectedAddress: ', expectedAddress)

    await factory.deployProxy(linkdropMaster.address, { gasLimit: 6000000 })

    proxy = new ethers.Contract(
      expectedAddress,
      LinkdropMastercopy.abi,
      linkdropMaster
    )

    let linkdropMasterAddress = await proxy.linkdropMaster()
    expect(linkdropMasterAddress).to.eq(linkdropMaster.address)

    let version = await proxy.version()
    expect(version).to.eq(1)
  })

  it('should correctly precompute create2 address', async () => {
    let linkdropMasterAddress = receiver.address
    let expectedAddress = await computeProxyAddress(
      factory.address,
      linkdropMasterAddress,
      masterCopy.address
    )

    await factory.deployProxy(linkdropMasterAddress, { gasLimit: 6000000 })

    proxy = new ethers.Contract(
      expectedAddress,
      LinkdropMastercopy.abi,
      linkdropMaster
    )

    let linkdropMasterAddr = await proxy.linkdropMaster()
    expect(linkdropMasterAddress).to.eq(linkdropMasterAddr)
  })

  it('should deploy another proxy', async () => {
    let linkdropMasterAddress = user.address
    let expectedAddress = await computeProxyAddress(
      factory.address,
      linkdropMasterAddress,
      masterCopy.address
    )

    await factory.deployProxy(linkdropMasterAddress, { gasLimit: 6000000 })

    proxy = new ethers.Contract(
      expectedAddress,
      LinkdropMastercopy.abi,
      linkdropMaster
    )

    let linkdropMasterAddr = await proxy.linkdropMaster()
    expect(linkdropMasterAddress).to.eq(linkdropMasterAddr)
  })

  it('should deploy new master copy of linkdrop implementation', async () => {
    let oldMasterCopyAddress = masterCopy.address
    masterCopy = await deployContract(deployer, LinkdropMastercopy, [], {
      gasLimit: 6000000
    })
    expect(masterCopy.address).to.not.eq(ethers.constants.AddressZero)
    expect(masterCopy.address).to.not.eq(oldMasterCopyAddress)
  })

  it('should update mastercopy address in factory', async () => {
    await factory.updateMasterCopy(masterCopy.address)
  })

  it('should upgrade proxy', async () => {
    factory = factory.connect(linkdropMaster)

    // Compute next address with js function
    let expectedAddress = await computeProxyAddress(
      factory.address,
      linkdropMaster.address,
      masterCopy.address
    )
    console.log('expectedAddress: ', expectedAddress)

    await factory.upgradeProxy({ gasLimit: 6000000 })

    proxy = new ethers.Contract(
      expectedAddress,
      LinkdropMastercopy.abi,
      linkdropMaster
    )

    let linkdropMasterAddress = await proxy.linkdropMaster()
    expect(linkdropMasterAddress).to.eq(linkdropMaster.address)

    let version = await proxy.version()
    console.log('version: ', +version)
    expect(version).to.eq(2)
  })
})
