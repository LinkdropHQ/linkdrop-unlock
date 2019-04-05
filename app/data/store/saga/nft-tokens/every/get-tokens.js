import { call, put } from 'redux-saga/effects'
import { getTokens } from 'data/api/nft-tokens'
import { getCrucialInfo } from '../helpers'

const generator = function * ({ payload }) {
  try {
    const { wallet } = payload
    const { assets } = yield call(getTokens, { wallet })
    const finalTokens = getCrucialInfo({ tokens: assets })
    yield put({ type: 'NFT_TOKENS.SET_TOKENS', payload: { tokens: finalTokens } })
  } catch (e) {
    console.error(e)
  }
}

export default generator
