import { takeEvery } from 'redux-saga/effects'

import checkBalance from './every/check-balance'
import checkBalanceClaimed from './every/check-balance-claimed'
import createWallet from './every/create-wallet'
import generateLink from './every/generate-link'
import testClaimTokens from './every/test-claim-tokens'

export default function * () {
  yield takeEvery('*USER.CHECK_BALANCE', checkBalance)
  yield takeEvery('*USER.CHECK_BALANCE_CLAIMED', checkBalanceClaimed)
  yield takeEvery('*USER.CREATE_WALLET', createWallet)
  yield takeEvery('*USER.GENERATE_LINK', generateLink)
  yield takeEvery('*USER.TEST_CLAIM_TOKENS', testClaimTokens)
}
