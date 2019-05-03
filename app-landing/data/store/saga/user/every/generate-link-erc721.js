import { put, select } from 'redux-saga/effects'
import { ethers } from 'ethers'
import LinkdropSDK from 'sdk/src/index'
import { jsonRpcUrl, networkId, host } from 'config'
const localStorage = window.localStorage

const generator = function * () {
  try {
    yield put({ type: 'USER.SET_LOADING', payload: { loading: true } })
    const tokenId = yield select(generator.selectors.tokenId)
    const privateKey = yield select(generator.selectors.privateKey)
    const ethersContractZeroAddress = ethers.constants.AddressZero
    const link = yield LinkdropSDK.generateLinkERC721(
      jsonRpcUrl,
      networkId,
      host,
      privateKey,
      ethersContractZeroAddress,
      tokenId,
      1900000000000000
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
  tokenId: ({ tokens: { tokenId } }) => tokenId
}
