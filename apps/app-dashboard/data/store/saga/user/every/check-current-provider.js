/* global web3 */
import { put } from 'redux-saga/effects'
import { delay } from 'redux-saga'
import initializeSdk from 'data/sdk'
import { jsonRpcUrl, apiHost } from 'app.config.js'
import { defineNetworkName } from 'linkdrop-commons'

const generator = function * ({ payload }) {
  try {
    yield delay(3000)
    const currentProvider = (web3 || {}).currentProvider
    if (!currentProvider) { return }
    const { selectedAddress, networkVersion } = currentProvider
    if (!selectedAddress || !networkVersion) { return }
    const networkName = defineNetworkName({ chainId: networkVersion })
    const sdk = initializeSdk({ chainId: networkName, linkdropMasterAddress: selectedAddress, jsonRpcUrl, apiHost })
    yield put({ type: 'USER.SET_SDK', payload: { sdk } })
    yield put({ type: 'USER.SET_CURRENT_ADDRESS', payload: { currentAddress: selectedAddress } })
    yield put({ type: 'USER.SET_CHAIN_ID', payload: { chainId: networkVersion } })
  } catch (e) {
    console.error(e)
  }
}

export default generator
generator.selectors = {
  step: ({ user: { step } }) => step
}
