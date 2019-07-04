import { takeEvery } from 'redux-saga/effects'

import sendEth from './every/send-eth'

export default function * () {
  yield takeEvery('*METAMASK.SEND_ETH', sendEth)
}
