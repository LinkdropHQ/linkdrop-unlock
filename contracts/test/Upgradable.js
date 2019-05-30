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

import { computeBytecode, computeProxyAddress } from '../scripts/utils'

const ethers = require('ethers')

chai.use(solidity)
const { expect } = chai

let provider = createMockProvider()

let [linkdropMaster, receiver, user, deployer] = getWallets(provider)

let masterCopy
let factory
let proxy
let bytecode

const bootstrap = '0x6394198df16000526103ff60206004601c335afa6040516060f3'

describe('Factory/Proxy tests', () => {
  //   before(async () => {})

  it('should deploy master copy of linkdrop implementation', async () => {
    masterCopy = await deployContract(deployer, LinkdropMastercopy, [], {
      gasLimit: 6000000
    })
    expect(masterCopy.address).to.not.eq(ethers.constants.AddressZero)
    console.log('masterCopy: ', masterCopy.address)
    bytecode = computeBytecode(masterCopy.address)
    console.log('pendingRuntimeCode: ', bytecode)
  })

  it('should deploy factory', async () => {
    factory = await deployContract(
      deployer,
      LinkdropFactory,
      [bootstrap, bytecode],
      {
        gasLimit: 6000000
      }
    )

    expect(factory.address).to.not.eq(ethers.constants.AddressZero)

    let version = await factory.version()
    expect(version).to.eq(1)
  })

  it('should deploy proxy and delegate to implementation', async () => {
    // Compute next address with js function
    let expectedAddress = computeProxyAddress(
      factory.address,
      linkdropMaster.address,
      bootstrap
    )

    await expect(
      factory.deployProxy(linkdropMaster.address, {
        gasLimit: 6000000
      })
    ).to.emit(factory, 'Deployed')

    proxy = new ethers.Contract(
      expectedAddress,
      LinkdropMastercopy.abi,
      deployer
    )

    let linkdropMasterAddress = await proxy.linkdropMaster()
    expect(linkdropMasterAddress).to.eq(linkdropMaster.address)

    let version = await proxy.version()
    console.log('version: ', +version)
    expect(version).to.eq(1)

    let owner = await proxy.owner()
    expect(owner).to.eq(factory.address)
  })

  it('should deploy new version of mastercopy', async () => {
    let oldMasterCopyAddress = masterCopy.address
    masterCopy = await deployContract(deployer, LinkdropMastercopy, [], {
      gasLimit: 6000000
    })

    expect(masterCopy.address).to.not.eq(ethers.constants.AddressZero)
    expect(masterCopy.address).to.not.eq(oldMasterCopyAddress)
  })

  it('should update bytecode in factory', async () => {
    bytecode = computeBytecode(masterCopy.address)
    console.log('bytecode: ', bytecode)

    await factory.updateBytecode(bytecode)
    let runtimeCode = await factory.getPendingRuntimeCode()
    console.log('runtimeCode: ', runtimeCode)
  })

  it('2 should deploy proxy and delegate to implementation', async () => {
    // Compute next address with js function
    let expectedAddress = computeProxyAddress(
      factory.address,
      linkdropMaster.address,
      bootstrap
    )

    console.log('expected proxy address: ', expectedAddress)
    factory = factory.connect(linkdropMaster)

    let isDeployed = await factory.isDeployed(linkdropMaster.address)
    console.log('isDeployed: ', isDeployed)

    let deployedAddress = await factory.functions.deployed(
      linkdropMaster.address
    )
    console.log('deployedAddress: ', deployedAddress)

    // await expect(
    await factory.destroyProxy({
      gasLimit: 6400000
    })
    console.log('Destroyed')

    isDeployed = await factory.isDeployed(linkdropMaster.address)
    console.log('isDeployed: ', isDeployed)

    deployedAddress = await factory.functions.deployed(linkdropMaster.address)
    console.log('deployedAddress: ', deployedAddress)

    await factory.deployProxy(linkdropMaster.address, {
      gasLimit: 6400000
    })
    // ).to.emit(factory, 'Deployed')
    console.log('Deployed again')

    isDeployed = await factory.isDeployed(linkdropMaster.address)
    console.log('isDeployed: ', isDeployed)

    deployedAddress = await factory.functions.deployed(linkdropMaster.address)
    console.log('deployedAddress: ', deployedAddress)

    let v = await factory.version()
    console.log('v: ', +v)

    proxy = new ethers.Contract(
      expectedAddress,
      LinkdropMastercopy.abi,
      deployer
    )

    // console.log('linkdrop mater wallet ', linkdropMaster.address)

    // let linkdropMasterAddress = await proxy.linkdropMaster()
    // console.log('linkdropMasterAddress in contract: ', linkdropMasterAddress)

    // console.log('deployer: ', deployer.address)
    // expect(linkdropMasterAddress).to.eq(linkdropMaster.address)

    let version = await proxy.version()
    console.log('version: ', +version)
    // expect(version).to.eq(1)
  })

  //   it('should correctly precompute create2 address', async () => {
  //     let linkdropMasterAddress = receiver.address
  //     let expectedAddress = await computeProxyAddress(
  //       factory.address,
  //       linkdropMasterAddress,
  //       masterCopy.address
  //     )

  //     await factory.deployProxy(linkdropMasterAddress, { gasLimit: 6000000 })

  //     proxy = new ethers.Contract(
  //       expectedAddress,
  //       LinkdropMastercopy.abi,
  //       linkdropMaster
  //     )

  //     let linkdropMasterAddr = await proxy.linkdropMaster()
  //     expect(linkdropMasterAddress).to.eq(linkdropMasterAddr)
  //   })

  //   it('should deploy another proxy', async () => {
  //     let linkdropMasterAddress = user.address
  //     let expectedAddress = await computeProxyAddress(
  //       factory.address,
  //       linkdropMasterAddress,
  //       masterCopy.address
  //     )

  //     await factory.deployProxy(linkdropMasterAddress, { gasLimit: 6000000 })

  //     proxy = new ethers.Contract(
  //       expectedAddress,
  //       LinkdropMastercopy.abi,
  //       linkdropMaster
  //     )

  //     let linkdropMasterAddr = await proxy.linkdropMaster()
  //     expect(linkdropMasterAddress).to.eq(linkdropMasterAddr)
  //   })

  //   it('should deploy new master copy of linkdrop implementation', async () => {
  //     let oldMasterCopyAddress = masterCopy.address
  //     masterCopy = await deployContract(deployer, LinkdropMastercopy, [], {
  //       gasLimit: 6000000
  //     })
  //     expect(masterCopy.address).to.not.eq(ethers.constants.AddressZero)
  //     expect(masterCopy.address).to.not.eq(oldMasterCopyAddress)
  //   })

  //   it('should update mastercopy address in factory', async () => {
  //     await factory.updateMasterCopy(masterCopy.address)
  //   })

  //   it('should upgrade proxy', async () => {
  //     factory = factory.connect(linkdropMaster)

  //     // Compute next address with js function
  //     let expectedAddress = await computeProxyAddress(
  //       factory.address,
  //       linkdropMaster.address,
  //       masterCopy.address
  //     )
  //     console.log('expectedAddress: ', expectedAddress)

  //     await factory.upgradeProxy({ gasLimit: 6000000 })

  //     proxy = new ethers.Contract(
  //       expectedAddress,
  //       LinkdropMastercopy.abi,
  //       linkdropMaster
  //     )

  //     let linkdropMasterAddress = await proxy.linkdropMaster()
  //     expect(linkdropMasterAddress).to.eq(linkdropMaster.address)

  //     let version = await proxy.version()
  //     console.log('version: ', +version)
  //     expect(version).to.eq(2)
  //   })
})
