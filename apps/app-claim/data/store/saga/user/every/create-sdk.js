import { put } from 'redux-saga/effects'
import initializeSdk from 'data/sdk'
import { jsonRpcUrl, apiHost, factory } from 'app.config.js'
import { defineNetworkName } from 'linkdrop-commons'

const generator = function * ({ payload }) {
  try {
    const { linkdropMasterAddress, chainId } = payload
    const networkName = defineNetworkName({ chainId })
    const sdk = initializeSdk({ factoryAddress: factory, chain: networkName, linkdropMasterAddress, jsonRpcUrl, apiHost })
    yield put({ type: 'USER.SET_SDK', payload: { sdk } })
  } catch (e) {
    console.error(e)
  }
}

export default generator
