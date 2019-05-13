/* global describe, it */
import { expect } from 'chai'
import checkBalanceGenerator from 'data/store/saga/tokens/every/check-balance.js'
import { createMockProvider } from 'ethereum-waffle'
import { put, select, call } from 'redux-saga/effects'
import { ethers, utils } from 'ethers'
import { defineNetworkName } from 'linkdrop-commons'
import { getTokensOpensea, getTokensTrustWallet } from 'data/api/tokens'
import TokenMock from 'contracts/TokenMock.json'

const provider = createMockProvider()
describe('data/store/saga/tokens/every/check-balance.js saga logic', () => {
  const account = '0xB8c77482e45F1F44dE1745F52C74426C631bDD52'
  const networkId = '1'
  const payload = { account, networkId }
  const gen = checkBalanceGenerator({ payload })

  it('enable loading', () => {
    expect(
      gen.next().value
    ).to.deep.equal(
      put({ type: 'CONTRACT.SET_LOADING', payload: { loading: true } })
    )
  })

  // it('get provider', () => {
  //   expect(
  //     gen.next().value
  //   ).to.deep.equal(
  //     ethers.getDefaultProvider('homestead')
  //   )
  // })

  // it('get contract instance', () => {
  //   const nextGenStep = gen.next(provider).value
  //   const expectedNextGenStep = new ethers.Contract(tokenAddress, config.erc20Abi, provider)
  //   expect(
  //     nextGenStep
  //   ).to.equal(
  //     expectedNextGenStep
  //   )
  // })

  // it('must put fetched tokens to store', () => {
  //   expect(
  //     gen.next(response).value
  //   ).to.deep.equal(
  //     put({ type: 'NFT_TOKENS.SET_TOKENS', payload: { tokens: response.assets } })
  //   )
  // })

  // it('must disable the loading', () => {
  //   expect(
  //     gen.next().value
  //   ).to.deep.equal(
  //     put({ type: 'NFT_TOKENS.SET_LOADING', payload: { loading: false } })
  //   )
  // })
})

// const generator = function * ({ payload }) {
//   try {
//     yield put({ type: 'USER.SET_LOADING', payload: { loading: true } })
//     const { account, networkId } = payload
//     const step = yield select(generator.selectors.step)
//     const networkName = defineNetworkName({ networkId })
//     const provider = yield ethers.getDefaultProvider(networkName)
//     const balance = yield provider.getBalance(account)
//     // check of ethereum balance
//     const balanceFormatted = utils.formatEther(balance)
//     // check of erc-721 balance
//     let { assets: erc721Balance = [] } = yield call(getTokensOpensea, { wallet: account, networkId })
//     let erc20Balance = { total: 0 }
//     // check of erc-20 (only on mainnet) balance
//     if (Number(networkId) === 1) {
//       erc20Balance = yield call(getTokensTrustWallet, { wallet: account })
//     }
//     if (erc721Balance.length > 0) {
//       yield put({ type: 'TOKENS.SET_TOKEN_STANDARD', payload: { standard: 'erc721' } })
//     } else if (Number(balanceFormatted) > 0 || Number(erc20Balance.total) > 0) {
//       yield put({ type: 'TOKENS.SET_TOKEN_STANDARD', payload: { standard: 'erc20' } })
//     }
//     if (step === 0) {
//       // if the step is 0, then it means that it was an initial check, and we have to move on first step
//       if (Number(balanceFormatted) > 0 || Number(erc20Balance.total) > 0 || erc721Balance.length > 0) {
//         // if the balance is more than 0, it means that we have money on account and we can generate link
//         yield put({ type: 'USER.SET_STEP', payload: { step: 2 } })
//       } else {
//         // if the balance is 0, it means that we need to start checking balance with interval
//         yield put({ type: 'USER.SET_STEP', payload: { step: 1 } })
//       }
//     }
//     // if step is not 0, then it means that checking goes in interval, so we can stop current check if all balances are empty

//     // dont know if it is a good idea, but I check balance with total amount of tokens
//     if (Number(balanceFormatted) === 0 && erc721Balance.length === 0 && Number(erc20Balance.total) === 0) {
//       return yield put({ type: 'USER.SET_LOADING', payload: { loading: false } })
//     }

//     // if ETH found on address -> set this balance to store
//     if (Number(balanceFormatted) > 0) {
//       yield put({ type: 'USER.SET_BALANCE', payload: { balanceFormatted, balance } })
//     }
//     // if ERC-721 found on address -> set this token id to store
//     if (erc721Balance.length > 0) {
//       yield put({ type: 'TOKENS.SET_TOKEN_ID', payload: { tokenId: erc721Balance[0].token_id } })
//       yield put({ type: 'TOKENS.SET_TOKEN_ADDRESS', payload: { tokenAddress: erc721Balance[0].asset_contract.address } })
//     }

//     // if ERC-20 found on address -> set this balance to store
//     if (Number(erc20Balance.total) > 0) {
//       const tokenAddress = erc20Balance.docs[0].contract.address
//       const tokenContract = yield new ethers.Contract(tokenAddress, TokenMock.abi, provider)
//       const balance = yield tokenContract.balanceOf(account)
//       const decimals = yield tokenContract.decimals()
//       const balanceFormatted = utils.formatUnits(balance, decimals)
//       yield put({ type: 'TOKENS.SET_TOKEN_ADDRESS', payload: { tokenAddress: tokenContract } })
//       yield put({ type: 'TOKENS.SET_TOKEN_STANDARD', payload: { standard: 'erc20' } })
//       yield put({ type: 'TOKENS.SET_BALANCE', payload: { balanceFormatted, balance } })
//     }

//     yield put({ type: 'USER.SET_LOADING', payload: { loading: false } })
//   } catch (e) {
//     console.error(e)
//     yield put({ type: 'USER.SET_ERRORS', payload: { errors: ['PROBLEM_WITH_EXRTERNAL_LIBRARY'] } })
//     yield put({ type: 'USER.SET_STEP', payload: { step: 1 } })
//   }
// }

// export default generator
// generator.selectors = {
//   step: ({ user: { step } }) => step
// }
