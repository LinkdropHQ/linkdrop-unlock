import { put } from 'redux-saga/effects'
import { jsonRpcUrl, apiHost } from 'config'
import LinkdropSDK from 'sdk/src/index'

const generator = function * ({ payload }) {
  try {
    const { wallet, nft, tokenId, expirationTime, linkKey, senderAddress, senderSignature } = payload
    yield put({ type: 'USER.SET_LOADING', payload: { loading: true } })
    const { success, txHash, error } = yield LinkdropSDK.claimERC721(
      jsonRpcUrl,
      apiHost,
      nft,
      tokenId,
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
