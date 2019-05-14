import { put, select } from 'redux-saga/effects'
import { ethers } from 'ethers'
import LinkdropSDK from 'sdk/src/index'
import { jsonRpcUrl, claimHost } from 'config'
import configs from 'config-landing'

const generator = function * ({ payload }) {
  try {
    yield put({ type: 'USER.SET_LOADING', payload: { loading: true } })
    const balance = yield select(generator.selectors.balance)
    const { networkId } = payload
    const privateKey = yield select(generator.selectors.privateKey)
    const ethersContractZeroAddress = ethers.constants.AddressZero
    const tokenAddress = yield select(generator.selectors.tokenAddress)
    console.log({
      1: jsonRpcUrl,
      2: networkId,
      3: claimHost,
      4: privateKey,
      5: tokenAddress ? 0 : balance,
      6: tokenAddress || ethersContractZeroAddress,
      7: tokenAddress ? balance : 0,
      8: configs.expirationTime
    })
    const link = yield LinkdropSDK.generateLink(
      jsonRpcUrl,
      networkId,
      claimHost,
      privateKey,
      tokenAddress ? 0 : balance,
      tokenAddress || ethersContractZeroAddress,
      tokenAddress ? balance : 0,
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
  tokenAddress: ({ tokens: { tokenAddress } }) => tokenAddress
}
