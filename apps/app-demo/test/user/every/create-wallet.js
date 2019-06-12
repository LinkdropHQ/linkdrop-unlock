/* global describe, it */
import { expect } from 'chai'
import createWalletGenerator from 'data/store/saga/user/every/create-wallet.js'
import { put } from 'redux-saga/effects'
import LinkdropSDK from 'sdk/src/index'
import { factory } from 'config'
import configs from 'config-demo'

describe('data/store/saga/user/every/create-wallet.js with account', () => {
  const wallet = '0xd7b4c49adc80caecafefd4aab8f94855fbb9f595'
  const privateKey = '0x740d96dd3735cb88b752c0bd7f1368d6b82bdbe37227dba2335261797715f121'
  const proxyAddress = '0xd7b4c49adc6666666664aab8f94855fbb9f44444'
  const gen = createWalletGenerator({ payload: { account: '0xd7b4c49adc80caecafefd4aab8f94855fbb9f595' } })

  it('enable loading', () => {
    expect(
      gen.next(wallet).value
    ).to.deep.equal(
      put({ type: 'USER.SET_LOADING', payload: { loading: true } })
    )
  })

  it('compute address', () => {
    expect(
      gen.next(wallet, privateKey).value.length
    ).to.deep.equal(
      LinkdropSDK.computeProxyAddress(factory, wallet, configs.initcode).length
    )
  })

  it('set proxy address', () => {
    expect(
      gen.next().value.length
    ).to.deep.equal(
      put({ type: 'USER.SET_WALLET', payload: { wallet: proxyAddress } }).length
    )
  })

  it('set master address', () => {
    expect(
      gen.next().value.length
    ).to.deep.equal(
      put({ type: 'USER.SET_MASTER_ADDRESS', payload: { masterAddress: wallet } }).length
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

describe('data/store/saga/user/every/create-wallet.js without account', () => {
  const wallet = '0xd7b4c49adc80caecafefd4aab8f94855fbb9f595'
  const privateKey = '0x740d96dd3735cb88b752c0bd7f1368d6b82bdbe37227dba2335261797715f121'
  const proxyAddress = '0xd7b4c49adc6666666664aab8f94855fbb9f44444'
  const gen = createWalletGenerator({ payload: { account: undefined } })

  it('enable loading', () => {
    expect(
      gen.next(wallet).value
    ).to.deep.equal(
      put({ type: 'USER.SET_LOADING', payload: { loading: true } })
    )
  })

  it('compute address', () => {
    expect(
      gen.next(wallet, privateKey).value.length
    ).to.deep.equal(
      LinkdropSDK.computeProxyAddress(factory, wallet, configs.initcode).length
    )
  })

  it('set proxy address', () => {
    expect(
      gen.next().value.length
    ).to.deep.equal(
      put({ type: 'USER.SET_WALLET', payload: { wallet: proxyAddress } }).length
    )
  })

  it('set master address', () => {
    expect(
      gen.next().value.length
    ).to.deep.equal(
      put({ type: 'USER.SET_MASTER_ADDRESS', payload: { masterAddress: wallet } }).length
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
