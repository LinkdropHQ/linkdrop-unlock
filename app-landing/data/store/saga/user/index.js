import { takeEvery } from 'redux-saga/effects'

import checkBalance from './every/sign-in'

export default function * () {
  yield takeEvery('*USER.CHECK_BALANCE', checkBalance)
}
