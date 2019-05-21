/* global describe, it, CONFIG */
import { expect } from 'chai'
import createWalletGenerator from 'data/store/saga/user/every/create-wallet.js'
import { put } from 'redux-saga/effects'
import { ethers } from 'ethers'
import LinkdropSDK from 'sdk/src/index'
const { factory, masterCopy } = CONFIG

describe('data/store/saga/user/every/create-wallet.js', () => {
  const newWallet = ethers.Wallet.createRandom()
  const { address: wallet, privateKey } = newWallet
  const proxyAddr = LinkdropSDK.computeProxyAddress(factory, wallet, masterCopy)
  const gen = createWalletGenerator()

  it('enable loading', () => {
    expect(
      gen.next().value
    ).to.deep.equal(
      put({ type: 'USER.SET_LOADING', payload: { loading: true } })
    )
  })

  it('set proxy address', () => {
    expect(
      gen.next().value.length
    ).to.deep.equal(
      put({ type: 'USER.SET_WALLET', payload: { wallet: proxyAddr } }).length
    )
  })

  it('set private key', () => {
    expect(
      gen.next().value.length
    ).to.deep.equal(
      put({ type: 'USER.SET_PRIVATE_KEY', payload: { privateKey } }).length
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
