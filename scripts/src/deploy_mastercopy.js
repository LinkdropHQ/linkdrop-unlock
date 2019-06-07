import { terminal as term } from 'terminal-kit'
import { getLinkdropMasterWallet, newError } from './utils'
import { ethers } from 'ethers'

import fs from 'fs'
import ora from 'ora'
import configs from '../../configs'

import LinkdropMastercopy from '../../contracts/build/LinkdropMastercopy'

const config = configs.get('scripts')
const configPath = configs.getPath('scripts')
const configBase = configs.getBase('scripts')

export const deploy = async () => {
  let linkdropMaster, spinner, factory, masterCopy, txHash

  // Get wallet
  linkdropMaster = getLinkdropMasterWallet()

  // Deploy contract
  try {
    spinner = ora({
      text: term.green.str('Deploying linkdrop contract master copy'),
      color: 'green'
    })

    spinner.start()

    factory = new ethers.ContractFactory(
      LinkdropMastercopy.abi,
      LinkdropMastercopy.bytecode,
      linkdropMaster
    )

    masterCopy = await factory.deploy({
      gasLimit: 6000000
    })

    await masterCopy.deployed()
  } catch (err) {
    throw newError(err)
  }

  spinner.succeed(term.str(`Master copy deployed at ^g${masterCopy.address}`))

  txHash = masterCopy.deployTransaction.hash
  term(`Tx Hash: ^g${txHash}\n`)

  // Save changes
  config.masterCopy = masterCopy.address

  fs.writeFile(configPath, JSON.stringify(config), err => {
    if (err) throw newError(err)
    term(`Updated linkdrop master copy address in ^_${configBase}\n`)
  })

  return masterCopy.address
}

deploy()
