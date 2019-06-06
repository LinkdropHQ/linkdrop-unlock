import { put } from 'redux-saga/effects'
import { ethers } from 'ethers'
import { defineNetworkName } from 'linkdrop-commons'

const generator = function * ({ payload }) {
  try {
    const { transactionId, chainId } = payload
    const networkName = defineNetworkName({ chainId })
    const provider = yield ethers.getDefaultProvider(networkName)
    const receipt = yield provider.getTransactionReceipt(transactionId)
    if (receipt && receipt.confirmations != null && receipt.confirmations > 0) {
      yield put({ type: 'TOKENS.SET_TRANSACTION_STATUS', payload: { transactionStatus: 'claimed' } })
    }
  } catch (e) {
    console.error(e)
  }
}

export default generator

generator.selectors = {
  wallet: ({ user: { wallet } }) => wallet
}
