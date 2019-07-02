import { takeEvery } from 'redux-saga/effects'

import getAssets from './every/get-assets'
import getTokenERC20Data from './every/get-token-erc20-data'
import getTokenERC721Data from './every/get-token-erc721-data'
import getEthData from './every/get-eth-data'

export default function * () {
  yield takeEvery('*TOKENS.GET_ASSETS', getAssets)
  yield takeEvery('*TOKENS.GET_TOKEN_ERC20_DATA', getTokenERC20Data)
  yield takeEvery('*TOKENS.GET_TOKEN_ERC721_DATA', getTokenERC721Data)
  yield takeEvery('*TOKENS.GET_ETH_DATA', getEthData)
}
