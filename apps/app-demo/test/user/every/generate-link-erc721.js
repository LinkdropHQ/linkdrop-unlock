/* global describe, it */
import { expect } from 'chai'
import generateLinkERC721Generator from 'data/store/saga/user/every/generate-link-erc721.js'
import { put, select } from 'redux-saga/effects'
import LinkdropSDK from 'sdk/src/index'
import configs from 'config-demo'
import { ethers } from 'ethers'
import { mocks } from 'linkdrop-commons'
import { createMockProvider } from 'ethereum-waffle'
import LinkdropFactory from 'contracts/LinkdropFactory.json'
import { jsonRpcUrl, claimHost, factory } from 'config'

const provider = createMockProvider()
describe('data/store/saga/user/every/generate-link-erc721.js ERC-721', () => {
  const chainId = '1'
  const payload = { chainId }
  const gen = generateLinkERC721Generator({ payload })
  const balance = { '_hex': '0x16345785d8a0000' }
  const privateKey = '0x0fc0c96d5aba156b1263311812a7b3d0812f4120b8f3f4288c0b7806fc2aaa2a'
  const tokenAddress = '0x1a031d35e1c90cd6e4228f03c2b31cea5a0956c89be0c1c576fa52b76e2f50e2'
  const tokenId = '4'
  const masterAddress = '0x1a031d35e1c90cd6e4228f03c2b31cea5a08393c89be0c1c576fa52b76e2f50e2'
  const link = {
    url: 'https://www.facebook.com/Anarchist.Academy.1992/'
  }

  it('enable loading', () => {
    expect(
      gen.next().value
    ).to.deep.equal(
      put({ type: 'USER.SET_LOADING', payload: { loading: true } })
    )
  })

  it('get balance from store', () => {
    expect(
      gen.next().value
    ).to.deep.equal(
      select(generateLinkERC721Generator.selectors.balance)
    )
  })

  it('get tokenId from store', () => {
    expect(
      gen.next(balance).value
    ).to.deep.equal(
      select(generateLinkERC721Generator.selectors.tokenId)
    )
  })

  it('get private key from store', () => {
    expect(
      gen.next(tokenId).value
    ).to.deep.equal(
      select(generateLinkERC721Generator.selectors.privateKey)
    )
  })

  it('get token address from store', () => {
    expect(
      gen.next(privateKey).value
    ).to.deep.equal(
      select(generateLinkERC721Generator.selectors.tokenAddress)
    )
  })

  // -----

  it('get provider name', () => {
    expect(
      gen.next(tokenAddress).value
    ).to.deep.equal(
      ethers.getDefaultProvider('homestead')
    )
  })

  it('get master address', () => {
    expect(
      gen.next(provider).value
    ).to.deep.equal(
      select(generateLinkERC721Generator.selectors.masterAddress)
    )
  })

  it('get factory contract', () => {
    const expected = gen.next(masterAddress).value
    const actual = new ethers.Contract(factory, LinkdropFactory.abi, provider)
    expect(
      typeof expected
    ).to.deep.equal(
      typeof actual
    )
  })

  it('get version', () => {
    expect(
      gen.next(mocks.factoryContract).value
    ).to.deep.equal(
      mocks.factoryContract.getProxyMasterCopyVersion(masterAddress)
    )
  })

  // ------

  it('generate link', () => {
    expect(
      gen.next(mocks.version).value
    ).to.deep.equal(
      LinkdropSDK.generateLinkERC721({
        jsonRpcUrl,
        chainId,
        host: claimHost,
        linkdropMasterPrivateKey: privateKey,
        weiAmount: 0,
        nftAddress: tokenAddress,
        tokenId,
        expirationTime: configs.expirationTime,
        isApprove: false,
        version: 1
      })
    )
  })

  it('set link', () => {
    expect(
      gen.next(link).value
    ).to.deep.equal(
      put({ type: 'USER.SET_LINK', payload: { link: link.url } })
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
