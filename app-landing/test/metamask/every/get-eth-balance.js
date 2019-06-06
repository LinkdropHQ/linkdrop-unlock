/* global describe, it */
import { expect } from 'chai'
import getEthBalanceGenerator from 'data/store/saga/metamask/every/get-eth-balance.js'
import { createMockProvider } from 'ethereum-waffle'
import { put } from 'redux-saga/effects'
import { ethers } from 'ethers'

const provider = createMockProvider()

describe('data/store/saga/metamask/every/get-eth-balance.js check balance of current account on metamask', () => {
  const account = '0xB8c77482e45F1F44dE1745F52C74426C631bDD52'
  const chainId = '1'
  const payload = { account, chainId }
  const gen = getEthBalanceGenerator({ payload })
  const balance = { '_hex': '0x16345785d8a0000' }
  const balanceFormatted = '0.1'

  it('enable loading', () => {
    expect(
      gen.next().value
    ).to.deep.equal(
      put({ type: 'MM.SET_LOADING', payload: { loading: true } })
    )
  })

  it('get provider', () => {
    expect(
      gen.next().value
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

  it('set balances', () => {
    expect(
      gen.next(balance, balanceFormatted).value
    ).to.deep.equal(
      put({ type: 'MM.SET_BALANCE', payload: { balanceFormatted, balance } })
    )
  })

  it('disable loading', () => {
    expect(
      gen.next().value
    ).to.deep.equal(
      put({ type: 'MM.SET_LOADING', payload: { loading: false } })
    )
  })
})
