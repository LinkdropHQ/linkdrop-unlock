import { put, select } from 'redux-saga/effects'
import LinkdropSDK from 'sdk/src/index'
import configs from 'config-demo'
import LinkdropFactory from 'contracts/LinkdropFactory.json'
import { ethers } from 'ethers'
import { factory, claimHost } from 'app.config.js'

const generator = function * ({ payload }) {
  try {
    yield put({ type: 'USER.SET_LOADING', payload: { loading: true } })
    const balance = yield select(generator.selectors.balance)
    const tokenId = yield select(generator.selectors.tokenId)
    const { chainId, provider } = payload
    const privateKey = yield select(generator.selectors.privateKey)
    const tokenAddress = yield select(generator.selectors.tokenAddress)
    const masterAddress = yield select(generator.selectors.masterAddress)
    const factoryContract = yield new ethers.Contract(factory, LinkdropFactory.abi, provider)
    const version = yield factoryContract.getProxyMasterCopyVersion(masterAddress)
    const link = yield LinkdropSDK.generateLinkERC721Web3({
      provider,
      chainId,
      host: claimHost,
      linkdropMasterPrivateKey: privateKey,
      weiAmount: balance || 0,
      nftAddress: tokenAddress,
      tokenId,
      expirationTime: configs.expirationTime,
      isApprove: 'false',
      version: String(version.toNumber())
    })

    yield put({ type: 'USER.SET_LINK', payload: { link: link.url } })
    yield put({ type: 'USER.SET_LOADING', payload: { loading: false } })
  } catch (e) {
    console.error(e)
  }
}

export default generator
generator.selectors = {
  balance: ({ tokens: { balance } }) => balance,
  privateKey: ({ user: { privateKey } }) => privateKey,
  tokenId: ({ tokens: { tokenId } }) => tokenId,
  tokenAddress: ({ tokens: { tokenAddress } }) => tokenAddress,
  masterAddress: ({ user: { masterAddress } }) => masterAddress
}
