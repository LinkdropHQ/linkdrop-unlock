import { put } from 'redux-saga/effects'
import { delay } from 'redux-saga'

const generator = function * ({ payload }) {
  try {
    const { links } = payload
    yield put({ type: 'USER.SET_LOADING', payload: { loading: true } })
    yield delay(1000)
    yield put({ type: 'USER.SET_STEP', payload: { step: 5 } })
    yield put({ type: 'USER.SET_LOADING', payload: { loading: false } })
  } catch (e) {
    console.error(e)
  }
}

export default generator
