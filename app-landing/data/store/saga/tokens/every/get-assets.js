import { put, select, call } from 'redux-saga/effects'
import { ethers, utils } from 'ethers'
import TokenMock from 'contracts/TokenMock.json'
import NFTMock from 'contracts/NFTMock.json'
import { getTokensTrustWallet } from 'data/api/tokens'
import { defineNetworkName } from 'linkdrop-commons'

const generator = function * ({ payload }) {
  try {
    const { account } = payload
    const { total, docs } = yield call(getTokensTrustWallet, { wallet: account })
    if (total && total > 0) {
      yield put({ type: 'TOKENS.SET_ASSETS', payload: { assets: docs } })
    }
  } catch (e) {
    console.error(e)
  }
}

export default generator
generator.selectors = {
  decimals: ({ tokens: { decimals } }) => decimals,
  tokenAddress: ({ tokens: { tokenAddress } }) => tokenAddress,
  wallet: ({ user: { wallet } }) => wallet
}
