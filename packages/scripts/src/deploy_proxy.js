import {
  getProvider,
  getString,
  getInt
} from './utils'
import LinkdropSDK from '@linkdrop/sdk'
import LinkdropFactory from '../../contracts/build/LinkdropFactory'
import { terminal as term } from 'terminal-kit'
import { ethers } from 'ethers'
const CAMPAIGN_ID = getInt('CAMPAIGN_ID')
const PROVIDER = getProvider()
// const LINKDROP_MASTER_WALLET = getLinkdropMasterWallet()
const FACTORY_ADDRESS = getString('FACTORY_ADDRESS')
const CHAIN = getString('CHAIN')
const JSON_RPC_URL = getString('jsonRpcUrl')

const deployProxyIfNeeded = async (spinner, linkdropMasterPrivateKey) => {
  const provider = getProvider()
  
  const linkdropMasterWallet = new ethers.Wallet(
    linkdropMasterPrivateKey,
    provider
  )
  
  const linkdropSDK = new LinkdropSDK({
    linkdropMasterAddress: linkdropMasterWallet.address,
    chain: CHAIN,
    jsonRpcUrl: JSON_RPC_URL,
    factoryAddress: FACTORY_ADDRESS
  })
  
  const proxyAddress = linkdropSDK.getProxyAddress(CAMPAIGN_ID)

  // check that proxy address is deployed
  const code = await PROVIDER.getCode(proxyAddress)

  if (code === '0x') {
    if (spinner) {
      spinner.info(term.bold.str(`Deploying proxy: ^g${proxyAddress}`))
    }
    const factoryContract = new ethers.Contract(
      FACTORY_ADDRESS,
      LinkdropFactory.abi,
      linkdropMasterWallet
    )
    const tx = await factoryContract.deployProxy(CAMPAIGN_ID)
    if (spinner) {
      spinner.info(term.bold.str(`Tx hash: ^g${tx.hash}`))
    }
  }
}

export default deployProxyIfNeeded
