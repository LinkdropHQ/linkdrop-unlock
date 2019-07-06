import { put } from 'redux-saga/effects'
import { ethers } from 'ethers'

const generator = function * ({ payload }) {
  try {
    const ethWalletContract = ethers.constants.AddressZero
    yield put({ type: 'USER.SET_LOADING', payload: { loading: true } })
    yield put({ type: 'TOKENS.SET_TOKEN_ADDRESS', payload: { tokenAddress: ethWalletContract } })
    yield put({ type: 'TOKENS.SET_TOKEN_TYPE', payload: { tokenType: 'erc20' } })
    yield put({ type: 'TOKENS.SET_SYMBOL', payload: { symbol: 'ETH' } })
    yield put({ type: 'TOKENS.SET_DECIMALS', payload: { decimals: 18 } })

    yield put({ type: 'USER.SET_LOADING', payload: { loading: false } })
  } catch (e) {
    console.error(e)
  }
}

export default generator
