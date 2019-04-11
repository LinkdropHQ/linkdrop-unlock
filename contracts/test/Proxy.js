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

const PROXY_BYTECODE = '14723a09acff6d2a60dcdf7aa4aff308fddc160c'

chai.use(solidity)
const { expect } = chai

let provider = createMockProvider()

let [sender, receiver, third] = getWallets(provider)
console.log('receiver: ', receiver.address)
console.log('sender: ', sender.address)

let tokenInstance
let masterCopy
let linkdropInstance // masterCopy
let factory
let proxy
let link
let receiverAddress
let receiverSignature
let tokenAddress
let claimAmount
let expirationTime

const bytecode = `0x${Proxy.bytecode}${PROXY_BYTECODE}`

describe('Linkdrop tests', () => {
  before(async () => {
    tokenInstance = await deployContract(sender, TokenMock)
  })

  it('should deploy master copy of linkdrop contract', async () => {
    masterCopy = await deployContract(sender, Linkdrop)
  })

  it('should deploy factory', async () => {
    factory = await deployContract(sender, Factory, [bytecode], {
      gasLimit: 6000000
    })
  })

  it('should correctly get create2 address', async () => {
    let expectedAddress = await computeProxyAddress(
      factory.address,
      receiver.address
    )

    await factory.deployProxy(receiver.address)

    let contractsDeployed = await factory.contractsDeployed()

    let deployedAddress = await factory.proxies(contractsDeployed)
    console.log('deployedAddress: ', deployedAddress)
    proxy = new ethers.Contract(deployedAddress, Wrapper.abi, sender)

    expect(expectedAddress.toString().toLowerCase()).to.be.equal(
      deployedAddress.toString().toLowerCase()
    )
  })

  it('should deploy another proxy', async () => {
    let expectedAddress = await computeProxyAddress(
      factory.address,
      sender.address
    )
    console.log('expectedAddress: ', expectedAddress)

    await factory.deployProxy(sender.address)

    let contractsDeployed = await factory.contractsDeployed()

    let deployedAddress = await factory.proxies(contractsDeployed)
    console.log('deployedAddress: ', deployedAddress)
    proxy = new ethers.Contract(deployedAddress, Wrapper.abi, sender)

    let senderAddr = await proxy.SENDER()
    console.log('sender: ', senderAddr)

    let ownerAddr = await proxy.owner()
    console.log('owner: ', ownerAddr)
  })

  //   it('should deploy another proxy', async () => {
  //     await factory.deployProxy(third.address)

  //     let contractsDeployed = await factory.contractsDeployed()
  //     console.log('contractsDeployed: ', +contractsDeployed)

  //     let addr = await factory.proxies(contractsDeployed)
  //     // let instance = new ethers.Contract(addr, Linkdrop.abi, provider)

  //     console.log('addr: ', addr)
  //     // let sende = await newLinkdrop.SENDER()
  //     // console.log('sender: ', sende)
  //   })
})
