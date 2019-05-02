import { put } from 'redux-saga/effects'
import { ethers, utils } from 'ethers'
import { defineNetworkName } from 'linkdrop-commons'

const generator = function * ({ payload }) {
  try {
    yield put({ type: 'USER.SET_LOADING', payload: { loading: true } })
    const { account, networkId } = payload
    const networkName = defineNetworkName({ networkId })
    const provider = yield ethers.getDefaultProvider(networkName)
    const balance = yield provider.getBalance(account)
    const balanceFormatted = utils.formatEther(balance)
    if (Number(balanceFormatted) === 0) {
      yield put({ type: 'USER.SET_CLAIMED_STATUS', payload: { claimed: true } })
    }
    yield put({ type: 'USER.SET_LOADING', payload: { loading: false } })
  } catch (e) {
    console.error(e)
  }
}

export default generator
