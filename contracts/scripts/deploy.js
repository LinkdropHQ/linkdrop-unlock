import Factory from '../build/Factory'
import Linkdrop from '../build/Linkdrop'
import Proxy from '../build/Proxy'
import Wrapper from '../build/Wrapper'

const ethers = require('ethers')

let receiver = ethers.Wallet.createRandom().address

let provider = ethers.getDefaultProvider('ropsten')
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

  linkdropFactory = await factory.deploy(proxyBytecode, linkdrop.address, {
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
  await factory.deployProxy(receiver)

  let contractsDeployed = await factory.contractsDeployed()
  console.log('contractsDeployed: ', contractsDeployed)
  //   let deployedAddress = await factory.proxies(contractsDeployed)
  //   console.log('deployedAddress: ', deployedAddress)
  //   let proxy = new ethers.Contract(deployedAddress, Wrapper.abi, wallet)
  //   let senda = await proxy.SENDER()
  //   console.log('senda: ', senda)
  //   let impl = await proxy.implementation()
  //   console.log('impl: ', impl)
}

;(async function () {
  await deployLinkdrop()
  await deployFactory()
  await deployProxy()
})()
