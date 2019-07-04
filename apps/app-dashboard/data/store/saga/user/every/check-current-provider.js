/* global web3 */
import { put } from 'redux-saga/effects'
import { delay } from 'redux-saga'
import LinkdropSDK from 'sdk/src/index'
import { factory } from 'app.config.js'
import configs from 'config-demo'

const generator = function * ({ payload }) {
  try {
    const proxy = yield LinkdropSDK.computeProxyAddress(factory, '0x50AD4A98eA644ff6C0CD467AB5D5C00928deF7FB', configs.initcode)
    console.log({ proxy })
    yield delay(3000)
    const currentProvider = (web3 || {}).currentProvider
    if (!currentProvider) { return }
    console.log('check current provider', { currentAddress: currentProvider.selectedAddress })
    yield put({ type: 'USER.SET_CURRENT_ADDRESS', payload: { currentAddress: currentProvider.selectedAddress } })
    yield put({ type: 'USER.SET_CHAIN_ID', payload: { chainId: currentProvider.networkVersion } })
  } catch (e) {
    console.error(e)
  }
}

export default generator
generator.selectors = {
  step: ({ user: { step } }) => step
}
