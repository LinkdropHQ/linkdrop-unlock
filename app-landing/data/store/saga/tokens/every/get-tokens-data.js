import { put } from 'redux-saga/effects'
import { ethers } from 'ethers'
import TokenMock from 'contracts/TokenMock.json'
import NFTMock from 'contracts/NFTMock.json'

import { defineNetworkName } from 'linkdrop-commons'

const generator = function * ({ payload }) {
  try {
    const ethWalletContract = ethers.constants.AddressZero
    yield put({ type: 'USER.SET_LOADING', payload: { loading: true } })
    const { tokenAddress, tokenType, chainId } = payload
    yield put({ type: 'TOKENS.SET_TOKEN_ADDRESS', payload: { tokenAddress: tokenType === 'eth' ? ethWalletContract : tokenAddress } })
    yield put({ type: 'TOKENS.SET_TOKEN_STANDARD', payload: { standard: tokenType === 'erc721' ? 'erc721' : 'erc20' } })
    const networkName = defineNetworkName({ chainId })
    const provider = yield ethers.getDefaultProvider(networkName)
    if (tokenType === 'eth' || tokenAddress === ethWalletContract) {
      yield put({ type: 'TOKENS.SET_SYMBOL', payload: { symbol: 'ETH' } })
      yield put({ type: 'TOKENS.SET_DECIMALS', payload: { decimals: 18 } })
    } else {
      if (tokenType === 'erc721') {
        const tokenContract = yield new ethers.Contract(tokenAddress, NFTMock.abi, provider)
        const symbol = yield tokenContract.symbol()
        yield put({ type: 'TOKENS.SET_SYMBOL', payload: { symbol } })
      } else {
        const tokenContract = yield new ethers.Contract(tokenAddress, TokenMock.abi, provider)
        const decimals = yield tokenContract.decimals()
        const symbol = yield tokenContract.symbol()
        yield put({ type: 'TOKENS.SET_ASSET_DECIMALS', payload: { decimals } })
        yield put({ type: 'TOKENS.SET_SYMBOL', payload: { symbol } })
      }
    }

    yield put({ type: 'USER.SET_LOADING', payload: { loading: false } })
  } catch (e) {
    console.error(e)
  }
}

export default generator
