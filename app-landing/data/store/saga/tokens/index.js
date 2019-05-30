import { takeEvery } from 'redux-saga/effects'

import checkTokensManually from './every/check-tokens-manually'
import getTokensData from './every/get-tokens-data'
import checkBalance from './every/check-balance'
import getAssets from './every/get-assets'
import checkERC20Balance from './every/check-erc20-balance'

export default function * () {
  yield takeEvery('*TOKENS.CHECK_TOKENS_MANUALLY', checkTokensManually)
  yield takeEvery('*TOKENS.GET_TOKENS_DATA', getTokensData)
  yield takeEvery('*TOKENS.CHECK_BALANCE', checkBalance)
  yield takeEvery('*TOKENS.GET_ASSETS', getAssets)
  yield takeEvery('*TOKENS.CHECK_ERC20_BALANCE', checkERC20Balance)
}
