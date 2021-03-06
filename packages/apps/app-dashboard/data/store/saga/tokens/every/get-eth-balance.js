import { put } from 'redux-saga/effects'
import { ethers, utils } from 'ethers'
import { defineNetworkName } from '@linkdrop/commons'

const generator = function * ({ payload }) {
  try {
    yield put({ type: 'USER.SET_LOADING', payload: { loading: true } })
    const { account, chainId } = payload
    const networkName = defineNetworkName({ chainId })
    const provider = yield ethers.getDefaultProvider(networkName)
    const ethBalance = yield provider.getBalance(account)

    // check of ethereum balance
    const ethBalanceFormatted = utils.formatEther(ethBalance)
    if (Number(ethBalanceFormatted) > 0) {
      yield put({ type: 'TOKENS.SET_ETH_BALANCE', payload: { ethBalanceFormatted, ethBalance } })
    }

    yield put({ type: 'USER.SET_LOADING', payload: { loading: false } })
  } catch (e) {
    console.error(e)
    yield put({ type: 'USER.SET_LOADING', payload: { loading: false } })
  }
}

export default generator
