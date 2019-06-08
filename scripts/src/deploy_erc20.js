import TokenMock from '../../contracts/build/TokenMock'
import { terminal as term } from 'terminal-kit'
import { getLinkdropMasterWallet, newError } from './utils'
import { ethers } from 'ethers'
import fs from 'fs'
import ora from 'ora'
import configs from '../../configs'

const config = configs.get('scripts')
const configPath = configs.getPath('scripts')

const LINKDROP_MASTER_WALLET = getLinkdropMasterWallet()

export const deploy = async () => {
  let spinner, factory, tokenMock, txHash

  try {
    spinner = ora({
      text: term.bold.green.str('Deploying mock ERC20 token contract'),
      color: 'green'
    })

    spinner.start()

    // Deploy contract
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
    spinner.fail(term.bold.red.str('Failed to deploy contract'))
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
