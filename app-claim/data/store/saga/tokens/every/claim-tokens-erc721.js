import { put } from 'redux-saga/effects'
import { jsonRpcUrl, host } from 'config'
import LinkdropSDK from 'sdk/src/index'

const generator = function * ({ payload }) {
  try {
    const { wallet, nft, tokenId, expirationTime, linkKey, senderAddress, senderSignature } = payload
    // тут доступны эти данные уже
    yield put({ type: 'USER.SET_LOADING', payload: { loading: true } })
    const result = yield LinkdropSDK.claimERC721(
      jsonRpcUrl,
      host,
      nft,
      tokenId,
      expirationTime,
      linkKey,
      senderAddress,
      senderSignature,
      wallet
    )

    yield put({ type: 'TOKENS.SET_TRANSACTION_ID', payload: { transactionId: result } })
  } catch (e) {
    console.error(e)
  }
}

export default generator

generator.selectors = {
  wallet: ({ user: { wallet } }) => wallet
}
