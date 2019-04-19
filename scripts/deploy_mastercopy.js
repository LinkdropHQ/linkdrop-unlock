import { deployMasterCopy } from './index'
  ;(async () => {
  console.log('Deploying mastercopy...\n')
  let masterCopyAddress = await deployMasterCopy()
  return masterCopyAddress
})()
