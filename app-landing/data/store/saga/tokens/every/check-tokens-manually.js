import { put, select } from 'redux-saga/effects'
import { ethers, utils } from 'ethers'
import config from 'config'
import TokenMock from 'contracts/TokenMock.json'

import { defineNetworkName } from 'linkdrop-commons'

const generator = function * () {
  try {
    const ethWalletContract = ethers.constants.AddressZero
    yield put({ type: 'USER.SET_LOADING', payload: { loading: true } })
    const tokenAddress = yield select(generator.selectors.tokenAddress)
    const wallet = yield select(generator.selectors.wallet)
    const networkName = defineNetworkName({ networkId: config.networkId })
    const provider = yield ethers.getDefaultProvider(networkName)
    if (ethWalletContract !== tokenAddress) {
      const tokenContract = yield new ethers.Contract(tokenAddress, TokenMock.abi, provider)
      const decimals = yield select(generator.selectors.decimals)
      const balance = yield tokenContract.balanceOf(wallet)
      const balanceFormatted = utils.formatUnits(balance, decimals)
      if (Number(balanceFormatted) > 0) {
        yield put({ type: 'USER.SET_BALANCE', payload: { balanceFormatted, balance: balance } })
      }
    } else {
      const balance = yield provider.getBalance(wallet)
      const balanceFormatted = utils.formatEther(balance)
      if (Number(balanceFormatted) > 0) {
        yield put({ type: 'USER.SET_BALANCE', payload: { balanceFormatted, balance: balance } })
      }
    }

    yield put({ type: 'USER.SET_LOADING', payload: { loading: false } })
  } catch (e) {
    console.error(e)
  }
}

export default generator
generator.selectors = {
  decimals: ({ tokens: { decimals } }) => decimals,
  tokenAddress: ({ tokens: { tokenAddress } }) => tokenAddress,
  wallet: ({ user: { wallet } }) => wallet
}
