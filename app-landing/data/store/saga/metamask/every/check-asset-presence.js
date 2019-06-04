import { put } from 'redux-saga/effects'
import { ethers } from 'ethers'
import NFTMock from 'contracts/NFTMock.json'
import { defineNetworkName } from 'linkdrop-commons'

const generator = function * ({ payload }) {
  try {
    const { networkId, tokenAddress } = payload
    yield put({ type: 'MM.SET_LOADING', payload: { loading: true } })
    const networkName = defineNetworkName({ networkId })
    const provider = yield ethers.getDefaultProvider(networkName)
    const tokenContract = yield new ethers.Contract(tokenAddress, NFTMock.abi, provider)
    const symbol = yield tokenContract.symbol()
    yield put({ type: 'MM.SET_ASSET_SYMBOL', payload: { symbol } })
    yield put({ type: 'MM.SET_LOADING', payload: { loading: false } })
  } catch (e) {
    console.error(e)
    yield put({ type: 'MM.SET_ASSET_ID', payload: { assetId: null } })
    yield put({ type: 'MM.SET_LOADING', payload: { loading: false } })
  }
}

export default generator
