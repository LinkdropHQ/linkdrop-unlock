import { put } from 'redux-saga/effects'

const generator = function * ({ payload }) {
  try {
    const { linkId, contract, initialBlock } = payload
    const eventPromise = new Promise((resolve, reject) => {
      contract.events.Claimed(
        {
          filter: { linkId },
          fromBlock: initialBlock,
          toBlock: 'latest'
        },
        (err, event) => {
          if (err) { console.error(err); return reject(err) }
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
