/* global describe, it */
import { put, call } from 'redux-saga/effects'
import { expect } from 'chai'
import getTokensGenerator from 'data/store/saga/nft-tokens/every/get-tokens.js'
import { getTokens } from 'data/api/nft-tokens'

describe('data/store/saga/nft-tokens/every/get-tokens.js saga logic', function () {
  const wallet = '0xc0ef659df9b0816c2cdf8b6e0403d8329898bd27df3d318d3c790e9b0d6664ff'
  const payload = { wallet }
  const gen = getTokensGenerator({ payload })
  const response = {
    assets: [
      {
        token_id: 1,
        image_preview_url: 'https://storage.opensea.io/0x5f37ef03130f92925ea56579b891261118773aea-preview/163-1553806161.png',
        description: 'description',
        name: 'Test Token'
      }
    ]
  }
  it('must empty all the current nft tokens', () => {
    expect(
      gen.next().value
    ).to.deep.equal(
      put({ type: 'NFT_TOKENS.SET_TOKENS', payload: { tokens: [] } })
    )
  })

  it('must start the loading', () => {
    expect(
      gen.next().value
    ).to.deep.equal(
      put({ type: 'NFT_TOKENS.SET_LOADING', payload: { loading: true } })
    )
  })

  it('must get nft tokens with wallet', () => {
    expect(
      gen.next().value
    ).to.deep.equal(
      call(getTokens, { wallet })
    )
  })

  it('must put fetched tokens to store', () => {
    expect(
      gen.next(response).value
    ).to.deep.equal(
      put({ type: 'NFT_TOKENS.SET_TOKENS', payload: { tokens: response.assets } })
    )
  })

  it('must disable the loading', () => {
    expect(
      gen.next().value
    ).to.deep.equal(
      put({ type: 'NFT_TOKENS.SET_LOADING', payload: { loading: false } })
    )
  })
})
