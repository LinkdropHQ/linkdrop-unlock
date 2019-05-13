import { takeEvery } from 'redux-saga/effects'

import getTokenERC20Data from './every/get-token-erc20-data'
import getTokenERC721Data from './every/get-token-erc721-data'

export default function * () {
  yield takeEvery('*CONTRACT.GET_TOKEN_ERC20_DATA', getTokenERC20Data)
  yield takeEvery('*CONTRACT.GET_TOKEN_ERC721_DATA', getTokenERC721Data)
}
