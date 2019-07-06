/* global web3 */
import { put } from 'redux-saga/effects'
import { ethers } from 'ethers'
import { factory } from 'app.config.js'
import { defineNetworkName } from 'linkdrop-commons'
import LinkdropFactory from 'contracts/LinkdropFactory.json'

const generator = function * ({ payload }) {
  try {
    yield put({ type: 'USER.SET_LOADING', payload: { loading: true } })
    const { chainId, account } = payload
    const newWallet = ethers.Wallet.createRandom()
    const { address: wallet, privateKey } = newWallet
    const networkName = defineNetworkName({ chainId })
    const provider = yield ethers.getDefaultProvider(networkName)
    const factoryContract = yield new ethers.Contract(factory, LinkdropFactory.abi, provider)
    const data = yield factoryContract.interface.functions.deployProxyWithSigner.encode([wallet])
    const promise = new Promise((resolve, reject) => {
      web3.eth.sendTransaction({ to: factory, gas: 300000, from: account, value: 0, data }, (err, txHash) => {
        if (err) { console.error(err); reject(err) }
        return resolve({ txHash })
      })
    })
    const { txHash } = yield promise
    yield put({ type: 'USER.SET_LOADING', payload: { loading: false } })
    yield put({ type: 'USER.SET_PRIVATE_KEY', payload: { privateKey } })
    yield put({ type: 'USER.SET_TX_HASH', payload: { txHash } })
    // тут у нас txhash который я прокину в стор и буду чекать по нему
  } catch (e) {
    console.error(e)
  }
}

export default generator
generator.selectors = {
  step: ({ user: { step } }) => step
}
