import { takeEvery } from 'redux-saga/effects'

import createProxyAddress from './every/create-proxy-address'
import createSigningKey from './every/create-signing-key'
import checkCurrentProvider from './every/check-current-provider'
import checkTxHash from './every/check-tx-hash'
import prepareVersionVar from './every/prepare-version-var'

export default function * () {
  yield takeEvery('*USER.CREATE_PROXY_ADDRESS', createProxyAddress)
  yield takeEvery('*USER.CREATE_SIGNING_KEY', createSigningKey)
  yield takeEvery('*USER.CHECK_CURRENT_PROVIDER', checkCurrentProvider)
  yield takeEvery('*USER.CHECK_TX_HASH', checkTxHash)
  yield takeEvery('*USER.PREPARE_VERSION_VAR', prepareVersionVar)
}
