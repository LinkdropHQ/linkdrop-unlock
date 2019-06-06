import { put } from 'redux-saga/effects'
import { jsonRpcUrl, apiHost } from 'config'
import LinkdropSDK from 'sdk/src/index'
import { ethers } from 'ethers'

const generator = function * ({ payload }) {
  try {
    const { wallet, tokenAddress, chainId, tokenAmount, weiAmount, expirationTime, linkKey, linkdropMasterAddress, linkdropSignerSignature } = payload
    yield put({ type: 'USER.SET_LOADING', payload: { loading: true } })
    const ethersContractZeroAddress = ethers.constants.AddressZero

    const { success, txHash, error: { reason = [] } = {} } = yield LinkdropSDK.claim({
      jsonRpcUrl,
      host: apiHost,
      weiAmount: tokenAddress === ethersContractZeroAddress ? weiAmount : '0',
      tokenAddress,
      tokenAmount: tokenAddress === ethersContractZeroAddress ? '0' : tokenAmount,
      expirationTime,
      linkKey,
      linkdropMasterAddress,
      linkdropSignerSignature,
      receiverAddress: wallet,
      isApprove: false,
      chainId,
      version: 1
    })

    if (success) {
      yield put({ type: 'TOKENS.SET_TRANSACTION_ID', payload: { transactionId: txHash } })
    } else {
      if (reason.length > 0) {
        if (reason[0] === 'Insufficient amount of eth') {
          yield put({ type: 'USER.SET_ERRORS', payload: { errors: ['LINK_FAILED'] } })
        }
      }
    }
    yield put({ type: 'USER.SET_LOADING', payload: { loading: false } })
  } catch (e) {
    console.error(e)
  }
}

export default generator

generator.selectors = {
  wallet: ({ user: { wallet } }) => wallet
}
