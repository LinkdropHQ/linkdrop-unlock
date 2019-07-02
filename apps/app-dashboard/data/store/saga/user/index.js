import { takeEvery } from 'redux-saga/effects'

import createWallet from './every/create-wallet'
import createSigningKey from './every/create-signing-key'
import checkCurrentProvider from './every/check-current-provider'

export default function * () {
  yield takeEvery('*USER.CREATE_WALLET', createWallet)
  yield takeEvery('*USER.CREATE_SIGNING_KEY', createSigningKey)
  yield takeEvery('*USER.CHECK_CURRENT_PROVIDER', checkCurrentProvider)
}
