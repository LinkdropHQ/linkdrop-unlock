import { put } from 'redux-saga/effects'
import { delay } from 'redux-saga'
import { jsonRpcUrl, host } from 'config'
import LinkdropSDK from 'sdk/src/index'

const generator = function * ({ payload }) {
  try {
    const { wallet, token, tokenAmount: amount, expirationTime, linkKey, senderAddress, senderSignature } = payload
    // тут доступны эти данные уже
    console.log({ wallet, token, tokenAmount: amount, expirationTime, linkKey, senderAddress, senderSignature })
    yield put({ type: 'USER.SET_LOADING', payload: { loading: true } })
    const result = yield LinkdropSDK.claim(
      jsonRpcUrl,
      host,
      token,
      amount,
      expirationTime,
      linkKey,
      senderAddress,
      senderSignature,
      wallet
      // receiverAddress
    )

    console.log({ result })
    // yield put({ type: 'USER.SET_TRANSACTION_ID', payload: { transactionId: '0xd003b90ae43dbd84691279a6c1ab93adb7e15299e11c619674acc267193d6ebc' } })
    // yield put({
    //   type: 'USER.SET_ERRORS',
    //   payload: {
    //     errors: ['LINK_EXPIRED'] // LINK_CANCELED, LINK_FAILED
    //   }
    // })
    // yield put({ type: 'USER.SET_STEP', payload: { step: 5 } })
  } catch (e) {
    console.error(e)
  }
}

export default generator

generator.selectors = {
  wallet: ({ user: { wallet } }) => wallet
}
