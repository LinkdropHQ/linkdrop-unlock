/* global CONFIG */
import { put, select } from 'redux-saga/effects'
import LinkdropSDK from 'sdk/src/index'
import configs from 'config-landing'
const { jsonRpcUrl, claimHost } = CONFIG

const generator = function * ({ payload }) {
  try {
    yield put({ type: 'USER.SET_LOADING', payload: { loading: true } })
    const balance = yield select(generator.selectors.balance)
    const tokenId = yield select(generator.selectors.tokenId)
    const { networkId } = payload
    const privateKey = yield select(generator.selectors.privateKey)
    const tokenAddress = yield select(generator.selectors.tokenAddress)
    const link = yield LinkdropSDK.generateLinkERC721(
      jsonRpcUrl,
      networkId,
      claimHost,
      privateKey,
      balance || 0,
      tokenAddress,
      tokenId,
      configs.expirationTime
    )

    yield put({ type: 'USER.SET_LINK', payload: { link: link.url } })
    yield put({ type: 'USER.SET_LOADING', payload: { loading: false } })
  } catch (e) {
    console.error(e)
  }
}

export default generator
generator.selectors = {
  balance: ({ user: { balance } }) => balance,
  balanceFormatted: ({ user: { balanceFormatted } }) => balanceFormatted,
  privateKey: ({ user: { privateKey } }) => privateKey,
  tokenId: ({ tokens: { tokenId } }) => tokenId,
  tokenAddress: ({ tokens: { tokenAddress } }) => tokenAddress
}
