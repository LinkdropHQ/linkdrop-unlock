import Registry from '../../contracts/build/Registry'
import { terminal as term } from 'terminal-kit'
import { getLinkdropMasterWallet, newError, getString } from './utils'
import { ethers } from 'ethers'
import fs from 'fs'
import ora from 'ora'
import configs from '../../configs'

const scriptsConfig = configs.get('scripts')
const scriptsConfigPath = configs.getPath('scripts')

const appConfig = configs.get('app')
const appConfigPath = configs.getPath('app')

const LINKDROP_MASTER_WALLET = getLinkdropMasterWallet()
const RELAYER_ADDRESS = getString('RELAYER_ADDRESS')

export const deploy = async () => {
  let spinner, factory, registry, txHash

  try {
    spinner = ora({
      text: term.bold.green.str('Deploying registry contract'),
      color: 'green'
    })

    spinner.start()

    // Deploy contract
    factory = new ethers.ContractFactory(
      Registry.abi,
      Registry.bytecode,
      LINKDROP_MASTER_WALLET
    )

    registry = await factory.deploy({
      gasLimit: 6000000
    })

    await registry.deployed()

    spinner.info(
      term.bold.green.str(`Adding ${RELAYER_ADDRESS} to whitelisted relayers`)
    )
    await registry.addRelayer(RELAYER_ADDRESS)
  } catch (err) {
    spinner.fail(term.bold.red.str('Failed to deploy contract'))
    throw newError(err)
  }

  spinner.succeed(
    term.bold.str(`Deployed registry contract at ^g${registry.address}`)
  )

  txHash = registry.deployTransaction.hash
  term.bold(`Tx Hash: ^g${txHash}\n`)

  // Save to scripts config
  scriptsConfig.REGISTRY_ADDRESS = registry.address

  fs.writeFile(scriptsConfigPath, JSON.stringify(scriptsConfig), err => {
    if (err) throw newError(err)
    term.bold(`Updated ^_${scriptsConfigPath}\n`)
  })

  // Save to app config
  appConfig.REGISTRY_ADDRESS = registry.address
  fs.writeFile(appConfigPath, JSON.stringify(appConfig), err => {
    if (err) throw newError(err)
    term.bold(`Updated ^_${appConfigPath}\n`)
  })

  return registry.address
}

deploy()
