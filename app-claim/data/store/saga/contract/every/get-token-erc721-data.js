import { put, call } from 'redux-saga/effects'
import { getERC721TokenData } from 'data/api/tokens'
import { ethers } from 'ethers'
import NFTMock from 'contracts/NFTMock.json'
import { defineNetworkName } from 'linkdrop-commons'

const generator = function * ({ payload }) {
  try {
    yield put({ type: 'CONTRACT.SET_LOADING', payload: { loading: true } })
    let image = +(new Date())
    let name = 'ERC-721 Token'
    const { nftAddress, networkId, tokenId } = payload
    const networkName = defineNetworkName({ networkId })
    const provider = yield ethers.getDefaultProvider(networkName)
    const nftContract = yield new ethers.Contract(nftAddress, NFTMock.abi, provider)
    const metadataURL = yield nftContract.tokenURI(tokenId)
    if (metadataURL !== '') {
      const data = yield call(getERC721TokenData, { erc721URL: metadataURL })
      if (data) {
        image = data.image
        name = data.name
      }
    }
    yield put({ type: 'CONTRACT.SET_SYMBOL', payload: { symbol: name } })

    yield put({ type: 'CONTRACT.SET_ICON', payload: { icon: image } })

    yield put({ type: 'CONTRACT.SET_AMOUNT', payload: { amount: undefined } })
    yield put({ type: 'CONTRACT.SET_LOADING', payload: { loading: false } })
    yield put({ type: 'USER.SET_STEP', payload: { step: 1 } })
  } catch (e) {
    console.error(e)
  }
}

export default generator
