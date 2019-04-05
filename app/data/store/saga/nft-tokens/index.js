
import { takeEvery } from 'redux-saga/effects'

import getTokens from './every/get-tokens'

export default function * () {
  yield takeEvery('*NFT_TOKENS.GET_TOKENS', getTokens)
}
