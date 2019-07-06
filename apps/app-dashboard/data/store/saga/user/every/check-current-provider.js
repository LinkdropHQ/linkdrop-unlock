/* global web3 */
import { put } from 'redux-saga/effects'
import { delay } from 'redux-saga'

const generator = function * ({ payload }) {
  try {
    yield delay(3000)
    const currentProvider = (web3 || {}).currentProvider
    if (!currentProvider) { return }
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
