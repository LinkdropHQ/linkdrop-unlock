/* global describe, it */
import { expect } from 'chai'
import getTokensDataGenerator from 'data/store/saga/tokens/every/get-tokens-data.js'
import { createMockProvider } from 'ethereum-waffle'
import { put } from 'redux-saga/effects'
import { ethers } from 'ethers'

const provider = createMockProvider()
describe('data/store/saga/tokens/every/get-tokens-data.js ETH', () => {
  const tokenAddress = '0x0000000000000000000000000000000000000000'
  const chainId = '1'
  const isERC721 = false
  const payload = { tokenAddress, isERC721, chainId }
  const gen = getTokensDataGenerator({ payload })

  it('enable loading', () => {
    expect(
      gen.next().value
    ).to.deep.equal(
      put({ type: 'USER.SET_LOADING', payload: { loading: true } })
    )
  })

  it('set address', () => {
    expect(
      gen.next().value
    ).to.deep.equal(
      put({ type: 'TOKENS.SET_TOKEN_ADDRESS', payload: { tokenAddress } })
    )
  })

  it('set standard', () => {
    expect(
      gen.next().value
    ).to.deep.equal(
      put({ type: 'TOKENS.SET_TOKEN_STANDARD', payload: { standard: 'erc20' } })
    )
  })

  it('get provider', () => {
    expect(
      gen.next().value
    ).to.deep.equal(
      ethers.getDefaultProvider('homestead')
    )
  })

  it('set symbol', () => {
    expect(
      gen.next(provider).value
    ).to.deep.equal(
      put({ type: 'TOKENS.SET_SYMBOL', payload: { symbol: 'ETH' } })
    )
  })

  it('set decimals', () => {
    expect(
      gen.next().value
    ).to.deep.equal(
      put({ type: 'TOKENS.SET_DECIMALS', payload: { decimals: 18 } })
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
