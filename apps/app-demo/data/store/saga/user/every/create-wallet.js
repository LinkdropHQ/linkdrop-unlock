import { put } from 'redux-saga/effects'
import { ethers } from 'ethers'
import LinkdropSDK from 'sdk/src/index'
import { factory } from 'config'
import configs from 'config-demo'
const localStorage = (typeof window === 'undefined' ? {} : window).localStorage

const generator = function * () {
  try {
    yield put({ type: 'USER.SET_LOADING', payload: { loading: true } })
    const newWallet = ethers.Wallet.createRandom()
    const { address: wallet, privateKey } = newWallet

    if (wallet) {
      const proxyAddr = yield LinkdropSDK.computeProxyAddress(factory, wallet, configs.initcode)
      yield put({ type: 'USER.SET_WALLET', payload: { wallet: proxyAddr } })
      yield put({ type: 'USER.SET_MASTER_ADDRESS', payload: { masterAddress: wallet } })
      localStorage && localStorage.setItem('wallet', proxyAddr)
      localStorage && localStorage.setItem('masterAddress', wallet)
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
