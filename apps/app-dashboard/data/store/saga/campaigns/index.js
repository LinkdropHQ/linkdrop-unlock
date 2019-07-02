import { takeEvery } from 'redux-saga/effects'

import prepareNewTokensData from './every/prepare-new-tokens-data'
import prepareNewEthData from './every/prepare-new-eth-data'
import proceedPayment from './every/proceed-payment'

export default function * () {
  yield takeEvery('*CAMPAIGNS.PREPARE_NEW_TOKENS_DATA', prepareNewTokensData)
  yield takeEvery('*CAMPAIGNS.PREPARE_NEW_ETH_DATA', prepareNewEthData)
  yield takeEvery('*CAMPAIGNS.PROCEED_PAYMENT', proceedPayment)
}
