import LinkdropFactory from '../../contracts/build/LinkdropFactory'
import LinkdropMastercopy from '../../contracts/build/LinkdropMastercopy'

import { terminal as term } from 'terminal-kit'
import { getLinkdropMasterWallet, newError, getString } from './utils'
import { ethers } from 'ethers'
import ora from 'ora'

ethers.errors.setLogLevel('error')

const LINKDROP_MASTER_WALLET = getLinkdropMasterWallet()
const FACTORY_ADDRESS = getString('FACTORY_ADDRESS')
const MASTERCOPY_ADDRESS = getString('masterCopy')

export const set = async () => {
  let spinner, factory, masterCopy, tx

  try {
    spinner = ora({
      text: term.bold.green.str('Setting master copy address in factory'),
      color: 'green'
    })

    spinner.start()

    masterCopy = new ethers.Contract(
      MASTERCOPY_ADDRESS,
      LinkdropMastercopy.abi,
      LINKDROP_MASTER_WALLET
    )

    const initialized = await masterCopy.initialized()

    if (initialized === true) {
      return spinner.fail(term.bold.red.str('Master copy already initialized'))
    }

    factory = new ethers.Contract(
      FACTORY_ADDRESS,
      LinkdropFactory.abi,
      LINKDROP_MASTER_WALLET
    )

    tx = await factory.setMasterCopy(MASTERCOPY_ADDRESS, {
      gasLimit: 1200000
    })
  } catch (err) {
    spinner.fail(term.bold.red.str('Failed to set master copy address'))
    throw newError(err)
  }

  spinner.succeed(
    term.bold.str(`Set master copy address to ^g${masterCopy.address}`)
  )

  term.bold(`Tx Hash: ^g${tx.hash}\n`)

  return masterCopy.address
}

set()
