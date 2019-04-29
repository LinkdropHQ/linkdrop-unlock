import { takeEvery } from 'redux-saga/effects'

import checkBalance from './every/check-balance'
import createWallet from './every/create-wallet'
import generateLink from './every/generate-link'
import testClaimTokens from './every/test-claim-tokens'

export default function * () {
  yield takeEvery('*USER.CHECK_BALANCE', checkBalance)
  yield takeEvery('*USER.CREATE_WALLET', createWallet)
  yield takeEvery('*USER.GENERATE_LINK', generateLink)
  yield takeEvery('*USER.TEST_CLAIM_TOKENS', testClaimTokens)
}
