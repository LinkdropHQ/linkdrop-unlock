import { deployFactory } from './index'
import { getMasterCopyAddress } from './utils'
  ;(async () => {
  console.log('Deploying factory...')
  let masterCopyAddress = getMasterCopyAddress()
  await deployFactory(masterCopyAddress)
})()
