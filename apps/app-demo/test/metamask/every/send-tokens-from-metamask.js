/* global describe, it */
import { expect } from 'chai'
import sendTokensGenerator from 'data/store/saga/metamask/every/send-tokens-from-metamask.js'
import { createMockProvider } from 'ethereum-waffle'
import { put, select } from 'redux-saga/effects'
import { ethers, utils } from 'ethers'
import TokenMock from 'contracts/TokenMock.json'
import { mocks } from 'linkdrop-commons'
const provider = createMockProvider()
const web3Obj = new mocks.Web3Mock(provider)

describe('data/store/saga/metamask/every/send-tokens-from-metamask.js send eth with metamask', () => {
  const toWallet = '0xB8c77482e45F1F44dE1745F52C74426C631bDD52'
  const currentAsset = ethers.constants.AddressZero
  const ethAmount = '0.001'
  const account = '0xbF0e4036BF968dD007F9B4A1BFdA4e54C042F612'
  const tokenAddress = '0x85d1f0d5ea43e6f31d4f6d1f302405373e095722'
  const assetAmount = 0
  const payload = { account, currentAsset, ethAmount, tokenAddress, assetAmount }
  const gen = sendTokensGenerator({ payload })
  const ethValueWei = utils.parseEther(ethAmount)
  const promise = new Promise((resolve, reject) => {
    web3Obj.eth.sendTransaction({ to: toWallet, from: account, value: ethValueWei }, result => resolve({ result }))
  })
  const result = { result: null }

  it('set status to initial', () => {
    expect(
      gen.next().value
    ).to.deep.equal(
      put({ type: 'MM.SET_STATUS', payload: { status: 'initial' } })
    )
  })

  it('get wallet', () => {
    expect(
      gen.next().value
    ).to.deep.equal(
      select(sendTokensGenerator.selectors.wallet)
    )
  })

  it('send transaction', () => {
    expect(
      gen.next(toWallet).value
    ).to.deep.equal(
      promise
    )
  })

  it('set new status', () => {
    expect(
      gen.next(result).value
    ).to.deep.equal(
      put({ type: 'MM.SET_STATUS', payload: { status: 'finished' } })
    )
  })
})

describe('data/store/saga/metamask/every/send-tokens-from-metamask.js send assets with metamask', () => {
  const toWallet = '0xB8c77482e45F1F44dE1745F52C74426C631bDD52'
  const currentAsset = 'custom_asset'
  const ethAmount = 0
  const account = '0xbF0e4036BF968dD007F9B4A1BFdA4e54C042F612'
  const tokenAddress = '0x85d1f0d5ea43e6f31d4f6d1f302405373e095722'
  const assetAmount = '100'
  const payload = { account, currentAsset, ethAmount, tokenAddress, assetAmount }
  const gen = sendTokensGenerator({ payload })
  const assetDecimals = 1
  const balanceFormatted = utils.formatUnits(assetAmount, assetDecimals)
  const transferData = undefined
  const promise = new Promise((resolve, reject) => {
    web3Obj.eth.sendTransaction({ to: tokenAddress, from: account, value: 0, data: transferData }, result => resolve({ result }))
  })
  const result = { result: null }

  it('set status to initial', () => {
    expect(
      gen.next().value
    ).to.deep.equal(
      put({ type: 'MM.SET_STATUS', payload: { status: 'initial' } })
    )
  })

  it('get wallet', () => {
    expect(
      gen.next().value
    ).to.deep.equal(
      select(sendTokensGenerator.selectors.wallet)
    )
  })

  it('set token address', () => {
    expect(
      gen.next(toWallet).value
    ).to.deep.equal(
      put({ type: 'TOKENS.SET_TOKEN_ADDRESS', payload: { tokenAddress } })
    )
  })

  it('get token contract address', () => {
    expect(
      gen.next().value
    ).to.deep.equal(
      web3Obj.eth.contract(TokenMock.abi).at(tokenAddress)
    )
  })

  it('get decimals', () => {
    expect(
      gen.next(mocks.tokenContract).value
    ).to.deep.equal(
      select(sendTokensGenerator.selectors.assetDecimals)
    )
  })

  it('get token contract data', () => {
    expect(
      gen.next(assetDecimals).value
    ).to.deep.equal(
      mocks.tokenContract.transfer.getData(toWallet, balanceFormatted, { from: account })
    )
  })

  it('send transaction', () => {
    expect(
      gen.next(transferData).value
    ).to.deep.equal(
      promise
    )
  })

  it('set new status', () => {
    expect(
      gen.next(result).value
    ).to.deep.equal(
      put({ type: 'MM.SET_STATUS', payload: { status: 'finished' } })
    )
  })
})
