import { put, select } from 'redux-saga/effects'
import { ethers } from 'ethers'
import { defineNetworkName } from 'linkdrop-commons'
const ls = (typeof window === 'undefined' ? {} : window).localStorage

const generator = function * ({ payload }) {
  try {
    yield put({ type: 'USER.SET_LOADING', payload: { loading: true } })
    const { txHash, chainId } = payload
    const networkName = defineNetworkName({ chainId })
    const provider = yield ethers.getDefaultProvider(networkName)
    const receipt = yield provider.getTransactionReceipt(txHash)
    if (receipt && receipt.status === 0) {
      yield put({ type: 'USER.SET_TRANSACTION_STATUS', payload: { transactionStatus: 'failed' } })
      yield put({ type: 'USER.SET_LOADING', payload: { loading: false } })
    }
    if (receipt && receipt.status === 1 && receipt.confirmations != null && receipt.confirmations > 0) {
      const privateKey = yield select(generator.selectors.privateKey)
      ls && ls.setItem && ls.setItem('privateKey', privateKey)
      yield put({ type: 'USER.SET_TRANSACTION_STATUS', payload: { transactionStatus: 'success' } })
      yield put({ type: 'USER.SET_LOADING', payload: { loading: false } })
    }
  } catch (e) {
    console.error(e)
  }
}

export default generator
generator.selectors = {
  privateKey: ({ user: { privateKey } }) => privateKey
}
