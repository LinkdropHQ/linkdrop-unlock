import LinkdropFactory from '../../contracts/build/LinkdropFactory'
import { terminal as term } from 'terminal-kit'
import { getLinkdropMasterWallet, newError, getInt, getString } from './utils'
import { ethers } from 'ethers'
import fs from 'fs'
import ora from 'ora'
import configs from '../../configs'

ethers.errors.setLogLevel('error')

const scriptsConfig = configs.get('scripts')
const scriptsConfigPath = configs.getPath('scripts')

const serverConfig = configs.get('server')
const serverConfigPath = configs.getPath('server')

const appConfig = configs.get('app')
const appConfigPath = configs.getPath('app')

const LINKDROP_MASTER_WALLET = getLinkdropMasterWallet()
const LINKDROP_MASTER_COPY_ADDRESS = getString('masterCopy')
const CHAIN_ID = getInt('chainId')

export const deploy = async () => {
  let spinner, factory, proxyFactory, txHash

  spinner = ora({
    text: term.bold.green.str('Deploying linkdrop proxy factory contract'),
    color: 'green'
  })

  spinner.start()

  // Deploy contract
  try {
    factory = new ethers.ContractFactory(
      LinkdropFactory.abi,
      LinkdropFactory.bytecode,
      LINKDROP_MASTER_WALLET
    )

    proxyFactory = await factory.deploy(
      LINKDROP_MASTER_COPY_ADDRESS,
      CHAIN_ID,
      {
        gasLimit: 6000000
      }
    )

    await proxyFactory.deployed()
  } catch (err) {
    spinner.fail(term.bold.red.str('Failed to deploy contract'))
    throw newError(err)
  }

  spinner.succeed(
    term.bold.str(`Deployed proxy factory at ^g${proxyFactory.address}`)
  )

  txHash = proxyFactory.deployTransaction.hash
  term.bold(`Tx Hash: ^g${txHash}\n`)

  // Save to scripts config
  scriptsConfig.factory = proxyFactory.address

  fs.writeFile(scriptsConfigPath, JSON.stringify(scriptsConfig), err => {
    if (err) throw newError(err)
    term.bold(`Updated ^_${scriptsConfigPath}\n`)
  })

  // Save to server config
  serverConfig.factory = proxyFactory.address
  fs.writeFile(serverConfigPath, JSON.stringify(serverConfig), err => {
    if (err) throw newError(err)
    term.bold(`Updated ^_${serverConfigPath}\n`)
  })

  // Save to app config
  appConfig.factory = proxyFactory.address
  fs.writeFile(appConfigPath, JSON.stringify(appConfig), err => {
    if (err) throw newError(err)
    term.bold(`Updated ^_${appConfigPath}\n`)
  })

  return proxyFactory.address
}

deploy()
