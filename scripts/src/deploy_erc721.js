import NFTMock from '../../contracts/build/NFTMock'
import { terminal as term } from 'terminal-kit'
import { newError, getLinkdropMasterWallet } from './utils'
import { ethers } from 'ethers'
import fs from 'fs'
import ora from 'ora'
import configs from '../../configs'

ethers.errors.setLogLevel('error')

const config = configs.get('scripts')
const configPath = configs.getPath('scripts')

const LINKDROP_MASTER_WALLET = getLinkdropMasterWallet()

export const deploy = async () => {
  let spinner, factory, nftMock, txHash

  try {
    spinner = ora({
      text: term.bold.green.str('Deploying mock ERC721 token contract'),
      color: 'green'
    })

    spinner.start()

    // Deploy contract
    factory = new ethers.ContractFactory(
      NFTMock.abi,
      NFTMock.bytecode,
      LINKDROP_MASTER_WALLET
    )

    nftMock = await factory.deploy({
      gasLimit: 6000000
    })

    await nftMock.deployed()
  } catch (err) {
    spinner.fail(term.bold.red.str('Failed to deploy contract'))
    throw newError(err)
  }

  spinner.succeed(term.bold.str(`Deployed mock NFT at ^g${nftMock.address}`))

  txHash = nftMock.deployTransaction.hash
  term.bold(`Tx Hash: ^g${txHash}\n`)

  // Save changes
  config.nftAddress = nftMock.address
  fs.writeFile(configPath, JSON.stringify(config), err => {
    if (err) throw newError(err)
    term.bold(`Updated ^_${configPath}\n`)
  })

  return nftMock.address
}

deploy()
