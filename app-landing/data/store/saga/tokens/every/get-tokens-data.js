import { put } from 'redux-saga/effects'
import { ethers } from 'ethers'
import config from 'config'
import TokenMock from 'contracts/TokenMock.json'
import NFTMock from 'contracts/NFTMock.json'

import { defineNetworkName } from 'linkdrop-commons'

const generator = function * ({ payload }) {
  try {
    const ethWalletContract = ethers.constants.AddressZero
    yield put({ type: 'USER.SET_LOADING', payload: { loading: true } })
    const { tokenAddress, isERC721 } = payload
    yield put({ type: 'TOKENS.SET_TOKEN_ADDRESS', payload: { tokenAddress } })
    yield put({ type: 'TOKENS.SET_TOKEN_STANDARD', payload: { standard: isERC721 ? 'erc721' : 'erc20' } })
    const networkName = defineNetworkName({ networkId: config.networkId })
    const provider = yield ethers.getDefaultProvider(networkName)
    let symbol
    let decimals
    if (ethWalletContract === tokenAddress) {
      symbol = 'ETH'
      decimals = 18
    } else {
      if (isERC721) {
        const tokenContract = yield new ethers.Contract(tokenAddress, NFTMock.abi, provider)
        symbol = yield tokenContract.symbol()
      } else {
        const tokenContract = yield new ethers.Contract(tokenAddress, TokenMock.abi, provider)
        decimals = yield tokenContract.decimals()
        symbol = yield tokenContract.symbol()
      }
    }

    if (decimals != null) {
      yield put({ type: 'TOKENS.SET_DECIMALS', payload: { decimals } })
    }
    if (symbol) {
      yield put({ type: 'TOKENS.SET_SYMBOL', payload: { symbol } })
    }

    yield put({ type: 'USER.SET_LOADING', payload: { loading: false } })
  } catch (e) {
    console.error(e)
  }
}

export default generator
