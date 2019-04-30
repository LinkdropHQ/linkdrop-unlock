import { put, select } from 'redux-saga/effects'
import { ethers } from 'ethers'
import LinkdropSDK from 'sdk/src/index'
import { jsonRpcUrl, networkId, host } from 'config'

const generator = function * ({ payload }) {
  try {
    yield put({ type: 'USER.SET_LOADING', payload: { loading: true } })
    const balance = yield select(generator.selectors.balance)
    const privateKey = yield select(generator.selectors.privateKey)
    const ethersContractZeroAddress = ethers.constants.AddressZero
    const link = yield LinkdropSDK.generateLink(
      jsonRpcUrl,
      networkId,
      host,
      privateKey,
      ethersContractZeroAddress,
      balance,
      1900000000000000
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
  privateKey: ({ user: { privateKey } }) => privateKey
}
