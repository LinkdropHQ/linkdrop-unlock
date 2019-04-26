import { put } from 'redux-saga/effects'
import { ethers, utils } from 'ethers'
import config from 'contract-config.json'
import { defineNetworkName } from '../helpers'

const generator = function * ({ payload }) {
  try {
    yield put({ type: 'USER.SET_LOADING', payload: { loading: true } })
    const { address, networkId } = payload
    const networkName = defineNetworkName({ networkId })
    const provider = yield ethers.getDefaultProvider(networkName)
    const balance = yield provider.getBalance(address)

    console.log({ balance })
    // .then((balance) => {
    //   let etherString = ethers.utils.formatEther(balance)
    //   console.log('Balance: ' + etherString)
    // })
    yield put({ type: 'USER.SET_LOADING', payload: { loading: false } })
  } catch (e) {
    console.error(e)
  }
}

export default generator
