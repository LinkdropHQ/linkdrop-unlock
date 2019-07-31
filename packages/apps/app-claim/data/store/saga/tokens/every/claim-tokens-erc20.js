import { put, select } from 'redux-saga/effects'

const generator = function * ({ payload }) {
  try {
    const { campaignId, wallet, tokenAddress, tokenAmount, weiAmount, expirationTime, linkKey, linkdropMasterAddress, linkdropSignerSignature } = payload
    yield put({ type: 'USER.SET_LOADING', payload: { loading: true } })
    const sdk = yield select(generator.selectors.sdk)
    const { success, txHash, error: { reason = [] } = {} } = yield sdk.claim({
      weiAmount: weiAmount || '0',
      tokenAddress,
      tokenAmount: tokenAmount || '0',
      expirationTime,
      linkKey,
      linkdropMasterAddress,
      linkdropSignerSignature,
      receiverAddress: wallet,
      campaignId
    })

    if (success) {
      yield put({ type: 'TOKENS.SET_TRANSACTION_ID', payload: { transactionId: txHash } })
    } else {
      if (reason.length > 0) {
        if (reason[0] === 'Insufficient amount of tokens' || reason[0] === 'Insufficient amount of eth') {
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
  sdk: ({ user: { sdk } }) => sdk
}
