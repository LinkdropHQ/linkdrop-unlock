import { takeEvery } from 'redux-saga/effects'

import claimTokens from './every/claim-tokens'

export default function * () {
  yield takeEvery('*TOKENS.CLAIM_TOKENS', claimTokens)
}
