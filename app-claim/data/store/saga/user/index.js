import { takeEvery } from 'redux-saga/effects'

import signIn from './every/sign-in'
import setWeb3Provider from './every/set-web3-provider'

export default function * () {
  yield takeEvery('*USER.SIGN_IN', signIn)
  yield takeEvery('*USER.SET_WEB3_PROVIDER', setWeb3Provider)
}
