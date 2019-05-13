// Deploy nft mock
import { deployERC721 } from './index'
  ;(async () => {
  console.log('Deploying nft contract...')
  await deployERC721()
})()
