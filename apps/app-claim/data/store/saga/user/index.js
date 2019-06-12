import { takeEvery } from 'redux-saga/effects'

import signIn from './every/sign-in'

export default function * () {
  yield takeEvery('*USER.SIGN_IN', signIn)
}
