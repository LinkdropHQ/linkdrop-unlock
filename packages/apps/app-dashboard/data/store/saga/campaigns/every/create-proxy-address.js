import { put, select } from 'redux-saga/effects'

const generator = function * ({ payload }) {
  try {
    const sdk = yield select(generator.selectors.sdk)
    const { campaignId = 0 } = payload
    yield put({ type: 'USER.SET_LOADING', payload: { loading: true } })
    const proxyAddr = yield sdk.getProxyAddress(campaignId)
    yield put({ type: 'CAMPAIGNS.SET_ID', payload: { id: campaignId } })
    yield put({ type: 'CAMPAIGNS.SET_PROXY_ADDRESS', payload: { proxyAddress: proxyAddr } })
    yield put({ type: 'USER.SET_LOADING', payload: { loading: false } })
  } catch (e) {
    console.error(e)
  }
}

export default generator
generator.selectors = {
  step: ({ user: { step } }) => step,
  sdk: ({ user: { sdk } }) => sdk
}
