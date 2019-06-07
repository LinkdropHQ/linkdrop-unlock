import { terminal as term } from 'terminal-kit'
import { getLinkdropMasterWallet, newError } from './utils'
import { ethers } from 'ethers'
import fs from 'fs'
import ora from 'ora'
import configs from '../../configs'
import NFTMock from '../../contracts/build/NFTMock'

ethers.errors.setLogLevel('error')

const config = configs.get('scripts')
const configPath = configs.getPath('scripts')
const configBase = configs.getBase('scripts')

export const deploy = async () => {
  let linkdropMaster, spinner, factory, nftMock, txHash

  // Get wallet
  linkdropMaster = getLinkdropMasterWallet()

  // Deploy contract
  try {
    spinner = ora({
      text: term.green.str('Deploying mock ERC721 token contract'),
      color: 'green'
    })

    spinner.start()

    factory = new ethers.ContractFactory(
      NFTMock.abi,
      NFTMock.bytecode,
      linkdropMaster
    )

    nftMock = await factory.deploy({
      gasLimit: 6000000
    })

    await nftMock.deployed()
  } catch (err) {
    throw newError(err)
  }

  spinner.succeed(term.str(`Mock NFT deployed at ^g${nftMock.address}`))

  txHash = nftMock.deployTransaction.hash
  term(`Tx Hash: ^g${txHash}\n`)

  // Save changes
  config.nftAddress = nftMock.address
  fs.writeFile(configPath, JSON.stringify(config), err => {
    if (err) throw newError(err)
    term(`Updated NFT address in ^_${configBase}\n`)
  })

  return nftMock.address
}

deploy()
