import { takeEvery } from 'redux-saga/effects'

import createWallet from './every/create-wallet'
import generateLink from './every/generate-link'

export default function * () {
  yield takeEvery('*USER.CREATE_WALLET', createWallet)
  yield takeEvery('*USER.GENERATE_LINK', generateLink)
}
