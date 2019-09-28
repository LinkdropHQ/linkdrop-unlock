import { put } from 'redux-saga/effects'

const generator = function * ({ payload }) {
  try {
    const { linkId, contract } = payload
    const eventPromise = new Promise((resolve, reject) => {
      const filter = contract.filters.ClaimedUnlock(linkId)
      contract.on(filter, (linkId, ethAmount, token, tokenAmount, receiver, lock, event) => {
        return resolve({ event })
      })
    })
    const { event } = yield eventPromise
    if (event && event.transactionHash) {
      yield put({ type: 'TOKENS.SET_TRANSACTION_ID', payload: { transactionId: event.transactionHash } })
      return yield put({ type: 'TOKENS.SET_TRANSACTION_STATUS', payload: { transactionStatus: 'claimed' } })
    }
  } catch (e) {
    console.error(e)
  }
}

export default generator
