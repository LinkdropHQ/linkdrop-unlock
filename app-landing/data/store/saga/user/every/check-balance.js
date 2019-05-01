import { put, select } from 'redux-saga/effects'
import { ethers, utils } from 'ethers'
import { defineNetworkName } from '../helpers'

const generator = function * ({ payload }) {
  try {
    yield put({ type: 'USER.SET_LOADING', payload: { loading: true } })
    const { account, networkId } = payload
    const step = yield select(generator.selectors.step)
    const networkName = defineNetworkName({ networkId })
    const provider = yield ethers.getDefaultProvider(networkName)
    const balance = yield provider.getBalance(account)
    const balanceFormatted = utils.formatEther(balance)
    if (step === 0) {
      // if the step is 0, then it means that it was an initial check, and we have to move on first step
      if (Number(balanceFormatted) > 0) {
        // if the balance is more than 0, it means that we have money on account and we can generate link
        yield put({ type: 'USER.SET_STEP', payload: { step: 2 } })
      } else {
        // if the balance is less than 0, it means that we need to start checking balance
        yield put({ type: 'USER.SET_STEP', payload: { step: 1 } })
      }
    }
    if (Number(balanceFormatted) === 0) {
      return yield put({ type: 'USER.SET_LOADING', payload: { loading: false } })
    }
    yield put({ type: 'USER.SET_BALANCE', payload: { balanceFormatted, balance } })
    yield put({ type: 'USER.SET_LOADING', payload: { loading: false } })
  } catch (e) {
    console.error(e)
  }
}

export default generator
generator.selectors = {
  step: ({ user: { step } }) => step
}
