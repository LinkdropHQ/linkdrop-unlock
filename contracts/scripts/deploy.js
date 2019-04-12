import Factory from '../build/Factory'
import Linkdrop from '../build/Linkdrop'
import Proxy from '../build/Proxy'

import chai from 'chai'
import { computeProxyAddress } from './utils'

const { expect } = chai
const ethers = require('ethers')

let receiver = ethers.Wallet.createRandom().address

// const url = 'http://localhost:9545'

// const provider = new ethers.providers.JsonRpcProvider(url)

let provider = ethers.getDefaultProvider('rinkeby')

let privateKey =
  'AB3DCF0D03472E041AC2B7C0148035DA3236B1BBF2AF21D032588803F16228F3'
let wallet = new ethers.Wallet(privateKey, provider)

let linkdrop, linkdropFactory

const proxyBytecode = `0x${Proxy.bytecode}`

const deployLinkdrop = async () => {
  let factory = new ethers.ContractFactory(
    Linkdrop.abi,
    Linkdrop.bytecode,
    wallet
  )

  linkdrop = await factory.deploy()

  await linkdrop.deployed()
  console.log(`Linkdrop contract deployed at ${linkdrop.address}`)
}

const deployFactory = async () => {
  let factory = new ethers.ContractFactory(
    Factory.abi,
    Factory.bytecode,
    wallet
  )

  linkdropFactory = await factory.deploy(linkdrop.address, {
    gasLimit: 6000000
  })

  await linkdropFactory.deployed()
  console.log(`Factory contract deployed at ${linkdropFactory.address}`)
}

const deployProxy = async sender => {
  let factory = new ethers.Contract(
    linkdropFactory.address,
    Factory.abi,
    wallet
  )

  // Compute next address with js function
  let expectedAddress = await computeProxyAddress(factory.address, receiver)
  console.log('expectedAddress: ', expectedAddress)

  await factory.deployProxy(receiver)

  let deployedAddress = await factory.computeProxyAddress(receiver)
  console.log(`Proxy contract deployed at ${deployedAddress}`)
  // expect(deployedAddress.toString().toLowerCase()).to.eq(
  //   expectedAddress.toString().toLowerCase()
  // )

  // let proxy = new ethers.Contract(deployedAddress, Wrapper.abi, wallet)
}

;(async function () {
  await deployLinkdrop()
  await deployFactory()
  await deployProxy()
})()
