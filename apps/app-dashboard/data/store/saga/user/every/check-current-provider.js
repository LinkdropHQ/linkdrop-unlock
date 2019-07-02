/* global web3 */
import { put } from 'redux-saga/effects'
import { delay } from 'redux-saga'

const generator = function * ({ payload }) {
  try {
    yield delay(3000)
    yield put({ type: 'USER.SET_CURRENT_ADDRESS', payload: { currentAddress: web3.currentProvider.selectedAddress } })
    yield put({ type: 'USER.SET_CHAIN_ID', payload: { chainId: web3.currentProvider.networkVersion } })
  } catch (e) {
    console.error(e)
  }
}

export default generator
generator.selectors = {
  step: ({ user: { step } }) => step
}
