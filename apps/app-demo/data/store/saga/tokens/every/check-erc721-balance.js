import { put } from 'redux-saga/effects'
import { ethers } from 'ethers'
import { defineNetworkName } from 'linkdrop-commons'
import NFTMock from 'contracts/NFTMock.json'

const generator = function * ({ payload }) {
  try {
    yield put({ type: 'USER.SET_ERRORS', payload: { errors: [] } })
    yield put({ type: 'USER.SET_LOADING', payload: { loading: true } })
    let { account, chainId, tokenAddress, tokenId } = payload
    const networkName = defineNetworkName({ chainId })
    const provider = yield ethers.getDefaultProvider(networkName)
    const nftContract = yield new ethers.Contract(tokenAddress, NFTMock.abi, provider)
    const nftContractOwner = yield nftContract.ownerOf(tokenId)
    if (nftContractOwner.toLowerCase() === account.toLowerCase()) {
      yield put({ type: 'USER.SET_ERRORS', payload: { errors: [] } })
      yield put({ type: 'TOKENS.SET_TOKEN_ID', payload: { tokenId: tokenId } })
      yield put({ type: 'TOKENS.SET_TOKEN_ADDRESS', payload: { tokenAddress } })
      yield put({ type: 'TOKENS.SET_TOKEN_STANDARD', payload: { standard: 'erc721' } })
    }

    yield put({ type: 'USER.SET_LOADING', payload: { loading: false } })
  } catch (e) {
    console.error(e)
    yield put({ type: 'USER.SET_STEP', payload: { step: 1 } })
    yield put({ type: 'USER.SET_LOADING', payload: { loading: false } })
    yield put({ type: 'USER.SET_ERRORS', payload: { errors: ['ERROR_OCCURED_WITH_ERC721'] } })
  }
}

export default generator
