import { takeEvery } from 'redux-saga/effects'

import createSigningKey from './every/create-signing-key'
import checkCurrentProvider from './every/check-current-provider'
import prepareVersionVar from './every/prepare-version-var'

export default function * () {
  yield takeEvery('*USER.CREATE_SIGNING_KEY', createSigningKey)
  yield takeEvery('*USER.CHECK_CURRENT_PROVIDER', checkCurrentProvider)
  yield takeEvery('*USER.PREPARE_VERSION_VAR', prepareVersionVar)
}
