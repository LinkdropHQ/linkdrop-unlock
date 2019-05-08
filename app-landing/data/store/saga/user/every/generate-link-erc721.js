import { put, select } from 'redux-saga/effects'
import LinkdropSDK from 'sdk/src/index'
import { jsonRpcUrl, claimHost } from 'config'
import configs from 'config-landing'

const localStorage = window.localStorage
const generator = function * ({ payload }) {
  try {
    yield put({ type: 'USER.SET_LOADING', payload: { loading: true } })
    const tokenId = yield select(generator.selectors.tokenId)
    const { networkId } = payload
    const privateKey = yield select(generator.selectors.privateKey)
    const tokenAddress = yield select(generator.selectors.tokenAddress)
    const link = yield LinkdropSDK.generateLinkERC721(
      jsonRpcUrl,
      networkId,
      claimHost,
      privateKey,
      tokenAddress,
      tokenId,
      configs.expirationTime
    )

    yield put({ type: 'USER.SET_LINK', payload: { link: link.url } })
    localStorage && localStorage.setItem('link', link.url)
    yield put({ type: 'USER.SET_LOADING', payload: { loading: false } })
  } catch (e) {
    console.error(e)
  }
}

export default generator
generator.selectors = {
  balanceFormatted: ({ user: { balanceFormatted } }) => balanceFormatted,
  privateKey: ({ user: { privateKey } }) => privateKey,
  tokenId: ({ tokens: { tokenId } }) => tokenId,
  tokenAddress: ({ tokens: { tokenAddress } }) => tokenAddress
}
