import Factory from '../build/Factory'
import Linkdrop from '../build/Linkdrop'

import chai from 'chai'
import { computeProxyAddress } from './utils'

const { expect } = chai
const ethers = require('ethers')

let receiver = ethers.Wallet.createRandom().address

// const provider = new ethers.providers.JsonRpcProvider('http://localhost:8545')
// let privateKey =
//   '0xe30fb386a390fadf392ca072f5363e741bfbbea3e0a868e3ad095392e27ecc15'

const provider = ethers.getDefaultProvider('rinkeby')
let privateKey =
  'AB3DCF0D03472E041AC2B7C0148035DA3236B1BBF2AF21D032588803F16228F3'

let wallet = new ethers.Wallet(privateKey, provider)

let linkdrop, linkdropFactory

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
  let expectedAddress = await computeProxyAddress(
    linkdropFactory.address,
    receiver,
    linkdrop.address
  )
  console.log('expectedAddress: ', expectedAddress)

  let tx = await factory.deployProxy(receiver)
  await tx.wait()

  console.log(`Proxy contract deployed at ${expectedAddress}`)

  let proxy = new ethers.Contract(expectedAddress, Linkdrop.abi, wallet)

  let senderAddress = await proxy.SENDER()
  console.log('senderAddress: ', senderAddress)
  expect(receiver).to.eq(senderAddress)
}

;(async function () {
  await deployLinkdrop()
  await deployFactory()
  await deployProxy()
})()
