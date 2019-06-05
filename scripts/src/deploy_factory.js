import { deployFactory } from './index'
import { getBytecode, getInitcode, getChainId } from './utils'
  ;(async () => {
  console.log('Deploying factory...')
  const initcode = getInitcode()
  const bytecode = getBytecode()
  const chainId = getChainId()
  await deployFactory(initcode, bytecode, chainId)
})()
