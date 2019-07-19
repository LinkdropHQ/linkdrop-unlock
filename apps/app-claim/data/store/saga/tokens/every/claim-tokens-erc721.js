import { put, select } from 'redux-saga/effects'

const generator = function * ({ payload }) {
  try {
    const { wallet, campaignId, nftAddress, tokenId, weiAmount, expirationTime, linkKey, linkdropSignerSignature } = payload
    yield put({ type: 'USER.SET_LOADING', payload: { loading: true } })
    const sdk = yield select(generator.selectors.sdk)
    const { success, txHash, error } = yield sdk.claimERC721({
      weiAmount: weiAmount || '0',
      nftAddress,
      tokenId,
      expirationTime,
      linkKey,
      linkdropSignerSignature,
      receiverAddress: wallet,
      campaignId
    })

    if (success) {
      yield put({ type: 'TOKENS.SET_TRANSACTION_ID', payload: { transactionId: txHash } })
    } else {
      console.error({ error })
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
