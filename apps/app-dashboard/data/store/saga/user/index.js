import { takeEvery } from 'redux-saga/effects'

import createWallet from './every/create-wallet'

export default function * () {
  yield takeEvery('*USER.CREATE_WALLET', createWallet)
}
