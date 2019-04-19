const config = require('../config/config.json')
const fs = require('fs')
;(async () => {
  config.factory = factory.address

  fs.writeFile('conf.json', JSON.stringify(config), err => {
    if (err) throw err
    console.log('conf.json was updates succesfully!')
  })

  //   console.log(`Current network: ${process.env.NETWORK}`)
  //   let linkdropMasterCopyAddress = await deployLinkdropMasterCopy()
  //   return linkdropMasterCopyAddress
})()
