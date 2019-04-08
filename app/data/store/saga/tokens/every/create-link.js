import { call, put, select } from 'redux-saga/effects'
import { getTokens } from 'data/api/nft-tokens'

const generator = function * ({ payload }) {
  try {
    const { amount, currency } = payload
    yield put({ type: 'TOKENS.SET_LOADING', payload: { loading: true } })
    const wallet = yield select(generator.selectors.wallet)
    const { assets } = yield call(getTokens, { wallet })
    if (assets) {
      yield put({ type: 'TOKENS.SET_LINK', payload: { link: 'https://pornhub.com' } })
    }
    yield put({ type: 'TOKENS.SET_LOADING', payload: { loading: false } })
  } catch (e) {
    console.error(e)
  }
}

export default generator

generator.selectors = {
  wallet: ({ user: { wallet } }) => wallet
}
