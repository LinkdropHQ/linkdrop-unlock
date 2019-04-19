import { deployFactory } from './index'
import { getMasterCopyAddress } from './utils'
  ;(async () => {
  console.log('Deploying factory...\n')
  let masterCopyAddress = getMasterCopyAddress()
  await deployFactory(masterCopyAddress)
})()
