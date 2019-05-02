import { takeEvery } from 'redux-saga/effects'

import checkTokensManually from './every/check-tokens-manually'
import getTokensData from './every/get-tokens-data'
import checkBalance from './every/check-balance'
import checkBalanceClaimed from './every/check-balance-claimed'
import testClaimTokens from './every/test-claim-tokens'

export default function * () {
  yield takeEvery('*TOKENS.CHECK_TOKENS_MANUALLY', checkTokensManually)
  yield takeEvery('*TOKENS.GET_TOKENS_DATA', getTokensData)
  yield takeEvery('*TOKENS.TEST_CLAIM_TOKENS', testClaimTokens)
  yield takeEvery('*TOKENS.CHECK_BALANCE', checkBalance)
  yield takeEvery('*TOKENS.CHECK_BALANCE_CLAIMED', checkBalanceClaimed)
}
