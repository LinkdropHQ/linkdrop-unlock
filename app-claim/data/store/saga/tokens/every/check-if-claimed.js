import { put, call } from 'redux-saga/effects'
import { ethers, utils } from 'ethers'
import { defineNetworkName } from 'linkdrop-commons'
import { getTokensOpensea, getTokensTrustWallet } from 'data/api/tokens'

const generator = function * ({ payload }) {
  try {
    yield put({ type: 'USER.SET_LOADING', payload: { loading: true } })
    const { account, networkId } = payload
    const networkName = defineNetworkName({ networkId })
    const provider = yield ethers.getDefaultProvider(networkName)
    const balance = yield provider.getBalance(account)
    // check of ethereum balance
    const balanceFormatted = utils.formatEther(balance)
    // check of erc-721 balance
    let { assets: erc721Balance = [] } = yield call(getTokensOpensea, { wallet: account, networkId })
    let erc20Balance = {}
    // check of erc-20 (only on mainnet) balance
    if (Number(networkId) === 1) {
      erc20Balance = yield call(getTokensTrustWallet, { wallet: account })
    }

    // dont know if it is a good idea, but I check balance with total amount of tokens
    if (Number(balanceFormatted) === 0 && erc721Balance.length === 0 && (Number(erc20Balance.total || 0) === 0)) {
      yield put({ type: 'USER.SET_ALREADY_CLAIMED', payload: { alreadyClaimed: true } })
    }

    yield put({ type: 'USER.SET_READY_TO_CLAIM', payload: { readyToClaim: true } })

    yield put({ type: 'USER.SET_LOADING', payload: { loading: false } })
  } catch (e) {
    console.error(e)
  }
}

export default generator
