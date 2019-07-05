import { takeEvery } from 'redux-saga/effects'

import getAssets from './every/get-assets'
import getEthData from './every/get-eth-data'
import getEthBalance from './every/get-eth-balance'
import generateErc20Link from './every/generate-erc20-link'
import getErc20Data from './every/get-erc20-data'
import getErc20Balance from './every/get-erc20-balance'

export default function * () {
  yield takeEvery('*TOKENS.GET_ASSETS', getAssets)
  yield takeEvery('*TOKENS.GET_ETH_DATA', getEthData)
  yield takeEvery('*TOKENS.GET_ETH_BALANCE', getEthBalance)
  yield takeEvery('*TOKENS.GENERATE_ERC20_LINK', generateErc20Link)
  yield takeEvery('*TOKENS.GET_ERC20_DATA', getErc20Data)
  yield takeEvery('*TOKENS.GET_ERC20_BALANCE', getErc20Balance)
}
