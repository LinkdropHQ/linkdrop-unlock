import { deployFactory } from './index'

import { getMasterCopyAddress, getChainId } from './utils'
  ;(async () => {
  console.log('Deploying factory...')
  const masterCopyAddress = getMasterCopyAddress()
  const chainId = getChainId()
  await deployFactory(masterCopyAddress, chainId)
})()
