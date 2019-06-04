import { put, call } from 'redux-saga/effects'
import { ethers } from 'ethers'
import NFTMock from 'contracts/NFTMock.json'
import { defineNetworkName } from 'linkdrop-commons'
import { getTokensOpensea } from 'data/api/tokens'

const generator = function * ({ payload }) {
  try {
    const { networkId, tokenAddress, account } = payload
    yield put({ type: 'MM.SET_LOADING', payload: { loading: true } })
    const networkName = defineNetworkName({ networkId })
    const provider = yield ethers.getDefaultProvider(networkName)
    const tokenContract = yield new ethers.Contract(tokenAddress, NFTMock.abi, provider)
    const symbol = yield tokenContract.symbol()
    yield put({ type: 'MM.SET_ASSET_SYMBOL', payload: { symbol } })

    let { assets: erc721Balance = [] } = yield call(getTokensOpensea, { wallet: account, networkId })
    console.log({ erc721Balance })

    yield put({ type: 'MM.SET_LOADING', payload: { loading: false } })
  } catch (e) {
    console.error(e)
    yield put({ type: 'MM.SET_ASSET_ID', payload: { assetId: null } })
  }
}

export default generator
