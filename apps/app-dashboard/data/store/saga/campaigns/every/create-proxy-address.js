import { put } from 'redux-saga/effects'
import LinkdropSDK from 'sdk/src/index'
import configs from 'config-dashboard'
import { factory } from 'app.config.js'
const ls = (typeof window === 'undefined' ? {} : window).localStorage

const generator = function * ({ payload }) {
  try {
    const { address } = payload
    yield put({ type: 'USER.SET_LOADING', payload: { loading: true } })
    const proxyAddr = yield LinkdropSDK.computeProxyAddress(factory, address, configs.initcode)
    yield put({ type: 'CAMPAIGNS.SET_PROXY_ADDRESS', payload: { proxyAddress: proxyAddr } })
    ls && ls.setItem && ls.setItem('proxyAddr', proxyAddr)
    yield put({ type: 'USER.SET_LOADING', payload: { loading: false } })
  } catch (e) {
    console.error(e)
  }
}

export default generator
generator.selectors = {
  step: ({ user: { step } }) => step
}
