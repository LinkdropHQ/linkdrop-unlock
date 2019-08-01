import LinkdropFactory from '../../contracts/build/LinkdropFactory'
import { terminal as term } from 'terminal-kit'
import { getLinkdropMasterWallet, newError, getString } from './utils'
import { ethers } from 'ethers'

import ora from 'ora'

const LINKDROP_MASTER_WALLET = getLinkdropMasterWallet()
const FACTORY_ADDRESS = getString('FACTORY_ADDRESS')
const MASTERCOPY_ADDRESS = getString('masterCopy')

export const set = async () => {
  let spinner, masterCopy, tx

  try {
    spinner = ora({
      text: term.bold.green.str('Setting master copy address in factory'),
      color: 'green'
    })

    spinner.start()

    const factoryContract = new ethers.Contract(
      FACTORY_ADDRESS,
      LinkdropFactory.abi,
      LINKDROP_MASTER_WALLET
    )

    tx = await factoryContract.setMasterCopy(MASTERCOPY_ADDRESS)
  } catch (err) {
    spinner.fail(term.bold.red.str('Failed to set master copy address'))
    throw newError(err)
  }

  spinner.succeed(term.bold.str(`Set master copy to ^g${masterCopy.address}`))

  term.bold(`Tx Hash: ^g${tx.hash}\n`)

  return masterCopy.address
}

set()
