import { put } from 'redux-saga/effects'
import { ethers, utils } from 'ethers'
import { defineNetworkName } from '../helpers'
import { getImages } from 'helpers'
import ERC20 from 'contracts/ERC20.json'

const generator = function * ({ payload }) {
  try {
    const ethWalletContract = ethers.constants.AddressZero
    yield put({ type: 'CONTRACT.SET_LOADING', payload: { loading: true } })
    const { amount, tokenAddress, networkId } = payload
    const networkName = defineNetworkName({ networkId })
    const provider = yield ethers.getDefaultProvider(networkName)
    let decimals
    let symbol
    let icon
    if (ethWalletContract === tokenAddress) {
      decimals = 18
      symbol = 'ETH'
      icon = getImages({ src: 'ether' }).image
    } else {
      const contract = yield new ethers.Contract(tokenAddress, ERC20.abi, provider)
      decimals = yield contract.decimals()
      symbol = yield contract.symbol()
      icon = `https://trustwalletapp.com/images/tokens/${tokenAddress.toLowerCase()}.png`
    }

    const amountBigNumber = utils.formatUnits(amount, decimals)
    if (decimals) {
      yield put({ type: 'CONTRACT.SET_DECIMALS', payload: { decimals } })
    }
    if (symbol) {
      yield put({ type: 'CONTRACT.SET_SYMBOL', payload: { symbol } })
    }
    yield put({ type: 'CONTRACT.SET_ICON', payload: { icon } })
    yield put({ type: 'CONTRACT.SET_AMOUNT', payload: { amount: amountBigNumber } })
    yield put({ type: 'CONTRACT.SET_LOADING', payload: { loading: false } })
    yield put({ type: 'USER.SET_STEP', payload: { step: 1 } })
  } catch (e) {
    console.error(e)
  }
}

export default generator
