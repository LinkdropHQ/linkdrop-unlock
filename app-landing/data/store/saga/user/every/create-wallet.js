import { put } from 'redux-saga/effects'
import { ethers } from 'ethers'
import LinkdropSDK from 'sdk/src/index'
import config from 'config'
const { masterCopy, factory } = config

const localStorage = window.localStorage
const generator = function * ({ payload }) {
  try {
    yield put({ type: 'USER.SET_LOADING', payload: { loading: true } })
    const newWallet = ethers.Wallet.createRandom()
    const { address: wallet, privateKey } = newWallet
    if (wallet) {
      const proxyAddr = LinkdropSDK.computeProxyAddress(factory, wallet, masterCopy)
      yield put({ type: 'USER.SET_WALLET', payload: { wallet: proxyAddr } })
      localStorage && localStorage.setItem('wallet', proxyAddr)
    }

    if (privateKey) {
      yield put({ type: 'USER.SET_PRIVATE_KEY', payload: { privateKey } })
      localStorage && localStorage.setItem('privateKey', privateKey)
    }

    yield put({ type: 'USER.SET_LOADING', payload: { loading: false } })
  } catch (e) {
    console.error(e)
  }
}

export default generator
generator.selectors = {
  step: ({ user: { step } }) => step
}
