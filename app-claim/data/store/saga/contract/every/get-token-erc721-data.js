import { put, call } from 'redux-saga/effects'
import { getTokenERC721Data } from 'data/api/tokens'

const generator = function * ({ payload }) {
  try {
    yield put({ type: 'CONTRACT.SET_LOADING', payload: { loading: true } })
    const { nftAddress, networkId } = payload
    const token = yield call(getTokenERC721Data, { tokenAddress: nftAddress, networkId })
    if (token.symbol) {
      yield put({ type: 'CONTRACT.SET_SYMBOL', payload: { symbol: token.symbol } })
    }

    yield put({ type: 'CONTRACT.SET_ICON', payload: { icon: token.featured_image_url || +(new Date()) } })

    yield put({ type: 'CONTRACT.SET_AMOUNT', payload: { amount: undefined } })
    yield put({ type: 'CONTRACT.SET_LOADING', payload: { loading: false } })
    yield put({ type: 'USER.SET_STEP', payload: { step: 1 } })
  } catch (e) {
    console.error(e)
  }
}

export default generator
