import { takeEvery } from 'redux-saga/effects'

import checkTokensManually from './every/check-tokens-manually'
import getTokensData from './every/get-tokens-data'
import checkBalance from './every/check-balance'
import getAssets from './every/get-assets'
import checkErc721Balance from './every/check-erc721-balance'

export default function * () {
  yield takeEvery('*TOKENS.CHECK_TOKENS_MANUALLY', checkTokensManually)
  yield takeEvery('*TOKENS.GET_TOKENS_DATA', getTokensData)
  yield takeEvery('*TOKENS.CHECK_BALANCE', checkBalance)
  yield takeEvery('*TOKENS.GET_ASSETS', getAssets)
  yield takeEvery('*TOKENS.CHECK_ERC721_BALANCE', checkErc721Balance)
}
