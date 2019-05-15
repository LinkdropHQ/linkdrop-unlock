import { put } from 'redux-saga/effects'
import { jsonRpcUrl, apiHost } from 'config'
import LinkdropSDK from 'sdk/src/index'
import { ethers } from 'ethers'

const generator = function * ({ payload }) {
  try {
    const { wallet, tokenAddress, tokenAmount, ethAmount, expirationTime, linkKey, senderAddress, senderSignature } = payload
    yield put({ type: 'USER.SET_LOADING', payload: { loading: true } })
    const ethersContractZeroAddress = ethers.constants.AddressZero
    const { success, txHash, error } = yield LinkdropSDK.claim(
      jsonRpcUrl,
      apiHost,
      tokenAddress === ethersContractZeroAddress ? ethAmount : '0',
      tokenAddress,
      tokenAddress === ethersContractZeroAddress ? '0' : tokenAmount,
      expirationTime,
      linkKey,
      senderAddress,
      senderSignature,
      wallet
    )

    if (success) {
      yield put({ type: 'TOKENS.SET_TRANSACTION_ID', payload: { transactionId: txHash } })
    } else {
      console.log({ error })
    }
  } catch (e) {
    console.error(e)
  }
}

export default generator

generator.selectors = {
  wallet: ({ user: { wallet } }) => wallet
}
