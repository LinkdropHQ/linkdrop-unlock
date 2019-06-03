import { deployFactory } from './index'
import { getBytecode, getInitcode } from './utils'
  ;(async () => {
  console.log('Deploying factory...')
  const initcode = getInitcode()
  const bytecode = getBytecode()
  await deployFactory(initcode, bytecode)
})()
