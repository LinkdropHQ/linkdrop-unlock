import { put, call } from 'redux-saga/effects'
import { getTokensTrustWallet } from 'data/api/tokens'

const generator = function * ({ payload }) {
  try {
    const { account } = payload
    const { total, docs } = yield call(getTokensTrustWallet, { wallet: account })
    if (total && total > 0) {
      yield put({ type: 'TOKENS.SET_ASSETS', payload: { assets: docs } })
    }
  } catch (e) {
    console.error(e)
  }
}

export default generator
