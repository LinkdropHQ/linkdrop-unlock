import { takeEvery } from 'redux-saga/effects'

import getTokenData from './every/get-token-data'

export default function * () {
  yield takeEvery('*CONTRACT.GET_TOKEN_DATA', getTokenData)
}
