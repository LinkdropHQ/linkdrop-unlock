import { takeEvery } from 'redux-saga/effects'

import prepareNew from './every/prepare-new'
import proceedPayment from './every/proceed-payment'

export default function * () {
  yield takeEvery('*CAMPAIGNS.PREPARE_NEW', prepareNew)
  yield takeEvery('*CAMPAIGNS.PROCEED_PAYMENT', proceedPayment)
}
