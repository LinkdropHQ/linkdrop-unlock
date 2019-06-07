import { terminal as term } from 'terminal-kit'
import { getLinkdropMasterWallet, newError } from './utils'
import { ethers } from 'ethers'

import fs from 'fs'
import ora from 'ora'
import configs from '../../configs'

import TokenMock from '../../contracts/build/TokenMock'

const config = configs.get('scripts')
const configPath = configs.getPath('scripts')
const configBase = configs.getBase('scripts')

export const deploy = async () => {
  let linkdropMaster, spinner, factory, tokenMock, txHash

  // Get wallet
  linkdropMaster = getLinkdropMasterWallet()

  // Deploy contract
  try {
    spinner = ora({
      text: term.green.str('Deploying mock ERC20 token contract'),
      color: 'green'
    })

    spinner.start()

    factory = new ethers.ContractFactory(
      TokenMock.abi,
      TokenMock.bytecode,
      linkdropMaster
    )

    tokenMock = await factory.deploy({
      gasLimit: 6000000
    })

    await tokenMock.deployed()
  } catch (err) {
    throw newError(err)
  }

  spinner.succeed(term.str(`Mock token deployed at ^g${tokenMock.address}`))

  txHash = tokenMock.deployTransaction.hash
  term(`Tx Hash: ^g${txHash}\n`)

  // Save changes
  config.tokenAddress = tokenMock.address
  fs.writeFile(configPath, JSON.stringify(config), err => {
    if (err) throw newError(err)
    term(`Token address successfully added to ^_${configBase}\n`)
  })

  return tokenMock.address
}

deploy()
