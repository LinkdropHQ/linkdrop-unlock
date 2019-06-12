/* global describe, it */
import { expect } from 'chai'
import checkBalanceGenerator from 'data/store/saga/tokens/every/check-balance.js'
import { createMockProvider } from 'ethereum-waffle'
import { put, select, call } from 'redux-saga/effects'
import { ethers } from 'ethers'
import { getTokensOpensea, getTokensTrustWallet } from 'data/api/tokens'

const provider = createMockProvider()
describe('data/store/saga/tokens/every/check-balance.js initial check balance with no balance detected', () => {
  const account = '0xB8c77482e45F1F44dE1745F52C74426C631bDD52'
  const chainId = '1'
  const payload = { account, chainId }
  const gen = checkBalanceGenerator({ payload })
  const balance = 0
  const step = 0
  const data = {}
  const erc721Balance = { assets: [] }

  it('enable loading', () => {
    expect(
      gen.next().value
    ).to.deep.equal(
      put({ type: 'USER.SET_LOADING', payload: { loading: true } })
    )
  })

  it('get current step', () => {
    expect(
      gen.next().value
    ).to.deep.equal(
      select(checkBalanceGenerator.selectors.step)
    )
  })

  it('get provider', () => {
    expect(
      gen.next(step).value
    ).to.deep.equal(
      ethers.getDefaultProvider('homestead')
    )
  })

  it('get balance', () => {
    expect(
      gen.next(provider).value
    ).to.deep.equal(
      provider.getBalance(account)
    )
  })

  it('get erc-721 balance', () => {
    expect(
      gen.next(balance).value
    ).to.deep.equal(
      call(getTokensOpensea, { wallet: account, chainId })
    )
  })

  it('get erc-20 balance', () => {
    expect(
      gen.next(erc721Balance).value
    ).to.deep.equal(
      call(getTokensTrustWallet, { wallet: account })
    )
  })

  it('go to step 1', () => {
    expect(
      gen.next(data).value
    ).to.deep.equal(
      put({ type: 'USER.SET_STEP', payload: { step: 1 } })
    )
  })

  // it('get contract instance', () => {
  //   const nextGenStep = gen.next(provider).value
  //   const expectedNextGenStep = new ethers.Contract(tokenAddress, config.erc20Abi, provider)
  //   expect(
  //     nextGenStep
  //   ).to.equal(
  //     expectedNextGenStep
  //   )
  // })
})

describe('data/store/saga/tokens/every/check-balance.js initial check balance with balance detected', () => {
  const account = '0xB8c77482e45F1F44dE1745F52C74426C631bDD52'
  const chainId = '1'
  const payload = { account, chainId }
  const gen = checkBalanceGenerator({ payload })
  const balance = { '_hex': '0x16345785d8a0000' }
  const balanceFormatted = '0.1'
  const step = 0
  const erc721Balance = { assets: [] }
  let erc20Balance = null
  const data = {}

  it('enable loading', () => {
    expect(
      gen.next().value
    ).to.deep.equal(
      put({ type: 'USER.SET_LOADING', payload: { loading: true } })
    )
  })

  it('get current step', () => {
    expect(
      gen.next().value
    ).to.deep.equal(
      select(checkBalanceGenerator.selectors.step)
    )
  })

  it('get provider', () => {
    expect(
      gen.next(step).value
    ).to.deep.equal(
      ethers.getDefaultProvider('homestead')
    )
  })

  it('get balance', () => {
    expect(
      gen.next(provider).value
    ).to.deep.equal(
      provider.getBalance(account)
    )
  })

  it('get erc-721 balance', () => {
    expect(
      gen.next(balance).value
    ).to.deep.equal(
      call(getTokensOpensea, { wallet: account, chainId })
    )
  })

  it('get erc-20 balance', () => {
    expect(
      gen.next(erc721Balance).value
    ).to.deep.equal(
      call(getTokensTrustWallet, { wallet: account })
    )
  })

  it('go to step 2', () => {
    expect(
      gen.next(data).value
    ).to.deep.equal(
      put({ type: 'USER.SET_STEP', payload: { step: 2 } })
    )
  })

  it('set balance', () => {
    expect(
      gen.next(erc20Balance).value
    ).to.deep.equal(
      put({ type: 'TOKENS.SET_BALANCE', payload: { balanceFormatted, balance } })
    )
  })

  it('set standard', () => {
    expect(
      gen.next().value
    ).to.deep.equal(
      put({ type: 'TOKENS.SET_TOKEN_STANDARD', payload: { standard: 'erc20' } })
    )
  })

  it('disable loading', () => {
    expect(
      gen.next().value
    ).to.deep.equal(
      put({ type: 'USER.SET_LOADING', payload: { loading: false } })
    )
  })
})
