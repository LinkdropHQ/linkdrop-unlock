import { deployLinkdropMasterCopy } from './index'
  ;(async () => {
  console.log(`Current network: ${process.env.NETWORK}`)
  let linkdropMasterCopyAddress = await deployLinkdropMasterCopy()
  return linkdropMasterCopyAddress
})()
