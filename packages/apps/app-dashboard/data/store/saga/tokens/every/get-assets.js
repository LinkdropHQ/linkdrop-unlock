import { put, call } from 'redux-saga/effects'
import { getTokensTrustwallet } from 'data/api/tokens'

const generator = function * ({ payload }) {
  try {
    const { currentAddress } = payload
    const { total, docs } = yield call(getTokensTrustwallet, { account: currentAddress })
    if (total && total > 0) {
      yield put({ type: 'TOKENS.SET_ASSETS', payload: { assets: docs } })
    }
  } catch (e) {
    console.error(e)
  }
}

export default generator
