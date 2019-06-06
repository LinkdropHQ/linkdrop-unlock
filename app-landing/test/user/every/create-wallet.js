/* global describe, it */
import { expect } from 'chai'
import createWalletGenerator from 'data/store/saga/user/every/create-wallet.js'
import { put } from 'redux-saga/effects'
import { ethers } from 'ethers'
import LinkdropSDK from 'sdk/src/index'
import { factory } from 'config'
import configs from 'config-landing'

describe('data/store/saga/user/every/create-wallet.js', () => {
  const newWallet = ethers.Wallet.createRandom()
  const { address: wallet, privateKey } = newWallet
  const proxyAddr = LinkdropSDK.computeProxyAddress(factory, wallet, configs.initcode)
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
