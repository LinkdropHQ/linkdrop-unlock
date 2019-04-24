import { put } from 'redux-saga/effects'
import { ethers, utils } from 'ethers'
import config from 'contract-config.json'
import { defineNetworkName } from '../helpers'
const generator = function * ({ payload }) {
  try {
    yield put({ type: 'CONTRACT.SET_LOADING', payload: { loading: true } })
    const { amount, tokenAddress, networkId } = payload
    const networkName = defineNetworkName({ networkId })
    const provider = yield ethers.getDefaultProvider(networkName)
    const contract = yield new ethers.Contract(tokenAddress, config.erc20Abi, provider)
    const decimals = yield contract.decimals()
    const symbol = yield contract.symbol()
    const amountBigNumber = utils.formatUnits(amount, decimals)
    if (decimals) {
      yield put({ type: 'CONTRACT.SET_DECIMALS', payload: { decimals } })
    }
    if (symbol) {
      yield put({ type: 'CONTRACT.SET_SYMBOL', payload: { symbol } })
    }
    yield put({ type: 'CONTRACT.SET_ICON', payload: { icon: `https://trustwalletapp.com/images/tokens/${tokenAddress.toLowerCase()}.png` } })
    yield put({ type: 'CONTRACT.SET_AMOUNT', payload: { amount: amountBigNumber } })
    yield put({ type: 'CONTRACT.SET_LOADING', payload: { loading: false } })
    yield put({ type: 'USER.SET_STEP', payload: { step: 1 } })
  } catch (e) {
    console.error(e)
  }
}

export default generator
