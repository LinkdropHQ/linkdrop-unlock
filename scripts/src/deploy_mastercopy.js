import { terminal as term } from 'terminal-kit'
import { LINKDROP_MASTER_WALLET, newError } from './utils'
import { ethers } from 'ethers'

import fs from 'fs'
import ora from 'ora'
import configs from '../../configs'

import LinkdropMastercopy from '../../contracts/build/LinkdropMastercopy'

const config = configs.get('scripts')
const configPath = configs.getPath('scripts')

export const deploy = async () => {
  let spinner, factory, masterCopy, txHash

  try {
    spinner = ora({
      text: term.bold.green.str('Deploying linkdrop contract master copy'),
      color: 'green'
    })

    spinner.start()

    // Deploy contract
    factory = new ethers.ContractFactory(
      LinkdropMastercopy.abi,
      LinkdropMastercopy.bytecode,
      LINKDROP_MASTER_WALLET()
    )

    masterCopy = await factory.deploy({
      gasLimit: 6000000
    })

    await masterCopy.deployed()
  } catch (err) {
    spinner.fail(term.bold.red.str('Failed to deploy contract'))
    throw newError(err)
  }

  spinner.succeed(
    term.bold.str(`Deployed master copy at ^g${masterCopy.address}`)
  )

  txHash = masterCopy.deployTransaction.hash
  term.bold(`Tx Hash: ^g${txHash}\n`)

  // Save changes
  config.masterCopy = masterCopy.address

  fs.writeFile(configPath, JSON.stringify(config), err => {
    if (err) throw newError(err)
    term.bold(`Updated ^_${configPath}\n`)
  })

  return masterCopy.address
}

deploy()
