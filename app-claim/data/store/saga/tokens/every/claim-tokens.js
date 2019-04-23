import { put } from 'redux-saga/effects'
import { delay } from 'redux-saga'

const generator = function * ({ payload }) {
  try {
    // const { wallet, token, tokenAmount: amount, expirationTime } = payload
    // тут доступны эти данные уже
    yield put({ type: 'USER.SET_LOADING', payload: { loading: true } })
    yield delay(2000)
    yield put({ type: 'USER.SET_TRANSACTION_ID', payload: { transactionId: '0xd003b90ae43dbd84691279a6c1ab93adb7e15299e11c619674acc267193d6ebc' } })
    yield delay(2000)
    // yield put({
    //   type: 'USER.SET_ERRORS',
    //   payload: {
    //     errors: ['LINK_EXPIRED'] // LINK_CANCELED, LINK_FAILED
    //   }
    // })
    console.log('here')
    yield put({ type: 'USER.SET_STEP', payload: { step: 5 } })
  } catch (e) {
    console.error(e)
  }
}

export default generator

generator.selectors = {
  wallet: ({ user: { wallet } }) => wallet
}
