import { call, put } from 'redux-saga/effects'
import { getTokens } from 'data/api/nft-tokens'
import { getCrucialInfo } from '../helpers'

const generator = function * ({ payload }) {
  try {
    yield put({ type: 'NFT_TOKENS.SET_TOKENS', payload: { tokens: [] } })
    yield put({ type: 'NFT_TOKENS.SET_LOADING', payload: { loading: true } })
    const { wallet } = payload
    const { assets } = yield call(getTokens, { wallet })
    if (assets) {
      const finalTokens = getCrucialInfo({ tokens: assets })
      yield put({ type: 'NFT_TOKENS.SET_TOKENS', payload: { tokens: finalTokens } })
    }
    yield put({ type: 'NFT_TOKENS.SET_LOADING', payload: { loading: false } })
  } catch (e) {
    console.error(e)
  }
}

export default generator
