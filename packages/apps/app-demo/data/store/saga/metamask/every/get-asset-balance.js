import { put } from 'redux-saga/effects'
import { ethers, utils } from 'ethers'
import TokenMock from 'contracts/TokenMock.json'
import { defineNetworkName } from 'linkdrop-commons'

const generator = function * ({ payload }) {
  try {
    yield put({ type: 'USER.SET_ERRORS', payload: { errors: [] } })
    const { chainId, tokenAddress, account } = payload
    yield put({ type: 'MM.SET_LOADING', payload: { loading: true } })
    const networkName = defineNetworkName({ chainId })
    const provider = yield ethers.getDefaultProvider(networkName)

    // checking balance of ERC-20 from blockchain by tokenAddress
    const tokenContract = yield new ethers.Contract(tokenAddress, TokenMock.abi, provider)
    const decimals = yield tokenContract.decimals()
    const symbol = yield tokenContract.symbol()
    const balance = yield tokenContract.balanceOf(account)
    const balanceFormatted = utils.formatUnits(balance, decimals)

    if (Number(balanceFormatted) > 0) {
      yield put({ type: 'MM.SET_ASSET_SYMBOL', payload: { symbol } })
      yield put({ type: 'MM.SET_ASSET_DECIMALS', payload: { decimals } })
      yield put({ type: 'MM.SET_ASSET_BALANCE', payload: { balanceFormatted, balance } })
    }

    yield put({ type: 'MM.SET_LOADING', payload: { loading: false } })
  } catch (e) {
    console.error(e)
    yield put({ type: 'MM.SET_ASSET_SYMBOL', payload: { symbol: null } })
    yield put({ type: 'MM.SET_ASSET_DECIMALS', payload: { decimals: null } })
    yield put({ type: 'MM.SET_ASSET_BALANCE', payload: { balanceFormatted: null, balance: null } })
    yield put({ type: 'MM.SET_LOADING', payload: { loading: false } })
    yield put({ type: 'USER.SET_ERRORS', payload: { errors: ['NO_TOKEN_ADDRESS_FOUND'] } })
  }
}

export default generator
