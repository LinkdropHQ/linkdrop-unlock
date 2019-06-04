import { takeEvery } from 'redux-saga/effects'

import getAssetBalance from './every/get-asset-balance'
import getEthBalance from './every/get-eth-balance'
import sendTokensFromMetamask from './every/send-tokens-from-metamask'
import checkAssetPresence from './every/check-asset-presence'

export default function * () {
  yield takeEvery('*MM.GET_ASSET_BALANCE', getAssetBalance)
  yield takeEvery('*MM.CHECK_ASSET_PRESENCE', checkAssetPresence)
  yield takeEvery('*MM.GET_ETH_BALANCE', getEthBalance)
  yield takeEvery('*MM.SEND_TOKENS_FROM_METAMASK', sendTokensFromMetamask)
}
