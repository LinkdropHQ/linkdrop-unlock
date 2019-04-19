import { deployFactory } from './index'
import { getMasterCopyAddress } from './utils'
  ;(async () => {
  console.log(`Current network: ${process.env.NETWORK}`)

  let masterCopyAddress = getMasterCopyAddress()
  await deployFactory(masterCopyAddress)
})()
