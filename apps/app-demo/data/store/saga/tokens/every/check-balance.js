import { put, select, call } from 'redux-saga/effects'
import { ethers, utils } from 'ethers'
import { defineNetworkName } from 'linkdrop-commons'
import { getTokensOpensea, getTokensTrustWallet } from 'data/api/tokens'
import TokenMock from 'contracts/TokenMock.json'

const generator = function * ({ payload }) {
  try {
    yield put({ type: 'USER.SET_LOADING', payload: { loading: true } })
    let { account, chainId, tokenAddress } = payload
    const step = yield select(generator.selectors.step)
    const networkName = defineNetworkName({ chainId })
    const provider = yield ethers.getDefaultProvider(networkName)
    const balance = yield provider.getBalance(account)

    // check of ethereum balance
    const balanceFormatted = utils.formatEther(balance)
    // check of erc-721 balance
    let { assets: erc721Balance = [] } = yield call(getTokensOpensea, { wallet: account, chainId })
    let erc20Balance = null
    // check of erc-20 (only on mainnet) balance
    if (Number(chainId) === 1 && !tokenAddress) {
      const data = yield call(getTokensTrustWallet, { wallet: account })
      tokenAddress = (((data.docs || [])[0] || {}).contract || {}).address
    }
    if (tokenAddress) {
      const tokenContract = yield new ethers.Contract(tokenAddress, TokenMock.abi, provider)
      const balance = yield tokenContract.balanceOf(account)
      const decimals = yield tokenContract.decimals()
      erc20Balance = {
        balanceFormatted: utils.formatUnits(balance, decimals),
        balance,
        tokenAddress
      }
    }
    if (step === 0) {
      // if the step is 0, then it means that it was an initial check, and we have to move on first step
      if (Number(balanceFormatted) > 0 || validERC20TokenBalance({ erc20Balance }) || erc721Balance.length > 0) {
        // if the balance is more than 0, it means that we have money on account and we can generate link
        yield put({ type: 'USER.SET_STEP', payload: { step: 2 } })
      } else {
        // if the balance is 0, it means that we need to start checking balance with interval
        yield put({ type: 'USER.SET_STEP', payload: { step: 1 } })
      }
    }
    // if step is not 0, then it means that checking goes in interval, so we can stop current check if all balances are empty
    if (Number(balanceFormatted) === 0 && erc721Balance.length === 0 && !validERC20TokenBalance({ erc20Balance })) {
      return yield put({ type: 'USER.SET_LOADING', payload: { loading: false } })
    }

    // if ETH found on address -> set this balance to store
    if (Number(balanceFormatted) > 0) {
      yield put({ type: 'TOKENS.SET_BALANCE', payload: { balanceFormatted, balance } })
      yield put({ type: 'TOKENS.SET_TOKEN_STANDARD', payload: { standard: 'erc20' } })
    }
    // if ERC-721 found on address -> set this token id to store
    if (erc721Balance.length > 0) {
      yield put({ type: 'TOKENS.SET_TOKEN_ID', payload: { tokenId: erc721Balance[0].token_id } })
      yield put({ type: 'TOKENS.SET_TOKEN_ADDRESS', payload: { tokenAddress: erc721Balance[0].asset_contract.address } })
      yield put({ type: 'TOKENS.SET_TOKEN_STANDARD', payload: { standard: 'erc721' } })
    }
    // if ERC-20 found on address -> set this balance to store
    if (validERC20TokenBalance({ erc20Balance })) {
      const {
        balanceFormatted,
        balance,
        tokenAddress
      } = erc20Balance
      yield put({ type: 'TOKENS.SET_TOKEN_ADDRESS', payload: { tokenAddress } })
      yield put({ type: 'TOKENS.SET_ASSET_BALANCE', payload: { balanceFormatted, balance } })
      yield put({ type: 'TOKENS.SET_TOKEN_STANDARD', payload: { standard: 'erc20' } })
    }

    yield put({ type: 'USER.SET_LOADING', payload: { loading: false } })
  } catch (e) {
    console.error(e)
    yield put({ type: 'USER.SET_ERRORS', payload: { errors: ['PROBLEM_WITH_EXRTERNAL_LIBRARY'] } })
    yield put({ type: 'USER.SET_STEP', payload: { step: 1 } })
  }
}

export default generator
generator.selectors = {
  step: ({ user: { step } }) => step
}

const validERC20TokenBalance = ({ erc20Balance }) => {
  if (erc20Balance === null) { return false }
  if (erc20Balance.balanceFormatted && Number(erc20Balance.balanceFormatted) === 0) { return false }
  return true
}
