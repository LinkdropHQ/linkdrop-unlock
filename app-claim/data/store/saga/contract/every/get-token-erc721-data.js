import { put, call } from 'redux-saga/effects'
import { getERC721TokenData, getERC721MetaData } from 'data/api/tokens'
import { ethers } from 'ethers'
import NFTMock from 'contracts/NFTMock.json'
import { defineNetworkName } from 'linkdrop-commons'

const generator = function * ({ payload }) {
  let image
  let name
  const { nftAddress, networkId, tokenId } = payload
  try {
    yield put({ type: 'CONTRACT.SET_LOADING', payload: { loading: true } })
    const networkName = defineNetworkName({ networkId })
    const provider = yield ethers.getDefaultProvider(networkName)
    const nftContract = yield new ethers.Contract(nftAddress, NFTMock.abi, provider)
    const metadataURL = yield nftContract.tokenURI(tokenId)
    const data = yield call(getERC721TokenData, { erc721URL: metadataURL })
    if (data) {
      image = data.image
      name = data.name
    }
    if (name) {
      yield put({ type: 'CONTRACT.SET_SYMBOL', payload: { symbol: name } })
    }

    yield put({ type: 'CONTRACT.SET_ICON', payload: { icon: image || +(new Date()) } })

    yield put({ type: 'CONTRACT.SET_AMOUNT', payload: { amount: undefined } })
    yield put({ type: 'CONTRACT.SET_LOADING', payload: { loading: false } })
    yield put({ type: 'USER.SET_STEP', payload: { step: 1 } })
  } catch (e) {
    const token = yield call(getERC721MetaData, { tokenAddress: nftAddress, networkId })
    if (token) {
      image = token.featured_image_url
      name = token.symbol
    }
    if (name) {
      yield put({ type: 'CONTRACT.SET_SYMBOL', payload: { symbol: name } })
    }

    yield put({ type: 'CONTRACT.SET_ICON', payload: { icon: image || +(new Date()) } })

    yield put({ type: 'CONTRACT.SET_AMOUNT', payload: { amount: undefined } })
    yield put({ type: 'CONTRACT.SET_LOADING', payload: { loading: false } })
    yield put({ type: 'USER.SET_STEP', payload: { step: 1 } })
  }
}

export default generator
