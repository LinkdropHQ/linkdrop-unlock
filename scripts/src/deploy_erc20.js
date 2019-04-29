// Deploy token mock
import { deployERC20 } from './index'
  ;(async () => {
  console.log('Deploying token contract...')
  await deployERC20()
})()
