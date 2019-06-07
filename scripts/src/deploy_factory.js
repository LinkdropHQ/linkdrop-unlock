import { terminal as term } from 'terminal-kit'
import {
  getMasterCopyAddress,
  getLinkdropMasterWallet,
  getChainId,
  newError
} from './utils'
import { ethers } from 'ethers'

import fs from 'fs'
import ora from 'ora'
import configs from '../../configs'
import LinkdropFactory from '../../contracts/build/LinkdropFactory'

ethers.errors.setLogLevel('error')

const scriptsConfig = configs.get('scripts')
const scriptsConfigPath = configs.getPath('scripts')
const scriptsConfigBase = configs.getBase('scripts')

const serverConfig = configs.get('server')
const serverConfigPath = configs.getPath('server')
const serverConfigBase = configs.getBase('server')

export const deploy = async () => {
  let linkdropMaster,
    spinner,
    factory,
    chainId,
    proxyFactory,
    masterCopyAddress,
    txHash

  linkdropMaster = getLinkdropMasterWallet()
  masterCopyAddress = getMasterCopyAddress()
  chainId = getChainId()

  // Deploy contract

  spinner = ora({
    text: term.green.str('Deploying linkdrop proxy factory contract'),
    color: 'green'
  })

  spinner.start()
  try {
    factory = new ethers.ContractFactory(
      LinkdropFactory.abi,
      LinkdropFactory.bytecode,
      linkdropMaster
    )

    proxyFactory = await factory.deploy(masterCopyAddress, chainId, {
      gasLimit: 6000000
    })

    await proxyFactory.deployed()
  } catch (err) {
    throw newError('Failed to deploy contract')
  }

  spinner.succeed(
    term.str(`Proxy factory deployed at ^g${proxyFactory.address}`)
  )

  txHash = proxyFactory.deployTransaction.hash
  term(`Tx Hash: ^g${txHash}\n`)

  // Save changes
  scriptsConfig.factory = proxyFactory.address
  serverConfig.factory = proxyFactory.address

  fs.writeFile(scriptsConfigPath, JSON.stringify(scriptsConfig), err => {
    if (err) throw newError(err)
  })
  fs.writeFile(serverConfigPath, JSON.stringify(serverConfig), err => {
    if (err) throw newError(err)
  })

  term(
    `Updated factory address in ^_${scriptsConfigBase}^ and ^_${serverConfigBase}\n`
  )

  return proxyFactory.address
}

deploy()
