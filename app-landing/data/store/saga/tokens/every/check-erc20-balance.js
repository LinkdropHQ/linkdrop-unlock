import { put } from 'redux-saga/effects'
import { ethers, utils } from 'ethers'
import TokenMock from 'contracts/TokenMock.json'
import { defineNetworkName } from 'linkdrop-commons'

const generator = function * ({ payload }) {
  try {
    const { account, networkId, tokenAddress, assetDecimals } = payload
    yield put({ type: 'USER.SET_LOADING', payload: { loading: true } })
    const networkName = defineNetworkName({ networkId })
    const provider = yield ethers.getDefaultProvider(networkName)
    const tokenContract = yield new ethers.Contract(tokenAddress, TokenMock.abi, provider)
    const balance = yield tokenContract.balanceOf(account)
    const balanceFormatted = utils.formatUnits(balance, assetDecimals)
    if (Number(balanceFormatted) > 0) {
      yield put({ type: 'TOKENS.SET_TOKEN_STANDARD', payload: { standard: 'erc20' } })
      yield put({ type: 'TOKENS.SET_ASSET_BALANCE', payload: { balanceFormatted, balance } })
      yield put({ type: 'TOKENS.SET_TOKEN_ADDRESS', payload: { tokenAddress } })
    }

    yield put({ type: 'USER.SET_LOADING', payload: { loading: false } })
  } catch (e) {
    console.error(e)
  }
}

export default generator
