import { put } from 'redux-saga/effects'
import { ethers, utils } from 'ethers'
import { defineNetworkName } from 'linkdrop-commons'

const generator = function * ({ payload }) {
  try {
    yield put({ type: 'MM.SET_LOADING', payload: { loading: true } })
    const { account, chainId } = payload
    const networkName = defineNetworkName({ chainId })
    const provider = yield ethers.getDefaultProvider(networkName)
    const balance = yield provider.getBalance(account)

    // check of ethereum balance
    const balanceFormatted = utils.formatEther(balance)
    if (Number(balanceFormatted) > 0) {
      yield put({ type: 'MM.SET_BALANCE', payload: { balanceFormatted, balance } })
    }

    yield put({ type: 'MM.SET_LOADING', payload: { loading: false } })
  } catch (e) {
    console.error(e)
    yield put({ type: 'MM.SET_LOADING', payload: { loading: false } })
  }
}

export default generator
