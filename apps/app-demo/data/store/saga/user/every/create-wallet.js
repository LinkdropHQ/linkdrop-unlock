import { put } from 'redux-saga/effects'
import { ethers } from 'ethers'
import LinkdropSDK from 'sdk/src/index'
import configs from 'config-demo'
import { factory } from 'app.config.js'
const localStorage = (typeof window === 'undefined' ? {} : window).localStorage

const generator = function * ({ payload }) {
  try {
    const { account } = payload
    yield put({ type: 'USER.SET_LOADING', payload: { loading: true } })
    const newWallet = ethers.Wallet.createRandom()
    const { address: wallet, privateKey } = newWallet

    if (wallet || account) {
      const mainAddress = account || wallet
      const proxyAddr = yield LinkdropSDK.computeProxyAddress(factory, mainAddress, configs.initcode)
      yield put({ type: 'USER.SET_WALLET', payload: { wallet: proxyAddr } })
      yield put({ type: 'USER.SET_MASTER_ADDRESS', payload: { masterAddress: mainAddress } })
      localStorage && localStorage.setItem('wallet', proxyAddr)
      localStorage && localStorage.setItem('masterAddress', mainAddress)
    }

    if (privateKey && !account) {
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
