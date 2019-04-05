import { call, put, select } from 'redux-saga/effects'

const generator = function * () {
  try {
    yield put({ type: 'CART.SET_ITEMS', items: [] })
  } catch (e) {
    console.error(e)
  }
}

export default generator
