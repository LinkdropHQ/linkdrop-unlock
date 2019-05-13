import { deployMasterCopy } from './index'
  ;(async () => {
  console.log('Deploying mastercopy...')
  let masterCopyAddress = await deployMasterCopy()
  return masterCopyAddress
})()
