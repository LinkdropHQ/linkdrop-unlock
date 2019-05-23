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

    const link = yield LinkdropSDK.generateLink({
      jsonRpcUrl,
      networkId,
      host: claimHost,
      linkdropMasterPrivateKey: privateKey,
      weiAmount: tokenAddress ? 0 : balance,
      tokenAddress: tokenAddress || ethersContractZeroAddress,
      tokenAmount: tokenAddress ? balance : 0,
      expirationTime: configs.expirationTime,
      isApprove: false
    })

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
