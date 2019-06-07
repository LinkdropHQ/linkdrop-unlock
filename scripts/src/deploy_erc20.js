import { terminal as term } from 'terminal-kit'
import { LINKDROP_MASTER_WALLET, newError } from './utils'
import { ethers } from 'ethers'

import fs from 'fs'
import ora from 'ora'
import configs from '../../configs'

import TokenMock from '../../contracts/build/TokenMock'

const config = configs.get('scripts')
const configPath = configs.getPath('scripts')

export const deploy = async () => {
  let spinner, factory, tokenMock, txHash

  // Deploy contract
  try {
    spinner = ora({
      text: term.bold.green.str('Deploying mock ERC20 token contract'),
      color: 'green'
    })

    spinner.start()

    factory = new ethers.ContractFactory(
      TokenMock.abi,
      TokenMock.bytecode,
      LINKDROP_MASTER_WALLET
    )

    tokenMock = await factory.deploy({
      gasLimit: 6000000
    })

    await tokenMock.deployed()
  } catch (err) {
    throw newError(err)
  }

  spinner.succeed(
    term.bold.str(`Deployed mock token at ^g${tokenMock.address}`)
  )

  txHash = tokenMock.deployTransaction.hash
  term.bold(`Tx Hash: ^g${txHash}\n`)

  // Save changes
  config.tokenAddress = tokenMock.address
  fs.writeFile(configPath, JSON.stringify(config), err => {
    if (err) throw newError(err)
    term.bold(`Updated ^_${configPath}\n`)
  })

  return tokenMock.address
}

deploy()
