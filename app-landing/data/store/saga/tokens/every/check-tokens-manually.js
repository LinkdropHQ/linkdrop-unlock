import { put, select } from 'redux-saga/effects'
import { ethers, utils } from 'ethers'
import TokenMock from 'contracts/TokenMock.json'
import NFTMock from 'contracts/NFTMock.json'
import { defineNetworkName } from 'linkdrop-commons'

const generator = function * ({ payload }) {
  try {
    const ethWalletContract = ethers.constants.AddressZero
    const { isERC721, networkId, tokenId } = payload
    yield put({ type: 'USER.SET_LOADING', payload: { loading: true } })
    const tokenAddress = yield select(generator.selectors.tokenAddress)
    const wallet = yield select(generator.selectors.wallet)
    const networkName = defineNetworkName({ networkId })
    const provider = yield ethers.getDefaultProvider(networkName)

    // if not ethereum
    if (ethWalletContract !== tokenAddress) {
      if (isERC721) {
        // checking balance of ERC-721 from manual check
        const nftContract = yield new ethers.Contract(tokenAddress, NFTMock.abi, provider)
        const nftContractOwner = yield nftContract.ownerOf(tokenId)
        if (nftContractOwner === wallet) {
          yield put({ type: 'TOKENS.SET_TOKEN_ID', payload: { tokenId: tokenId } })
        }
      } else {
        // checking balance of ERC-20 from blockchain by tokenAddress
        const tokenContract = yield new ethers.Contract(tokenAddress, TokenMock.abi, provider)
        const decimals = yield select(generator.selectors.decimals)
        const balance = yield tokenContract.balanceOf(wallet)
        const balanceFormatted = utils.formatUnits(balance, decimals)
        if (Number(balanceFormatted) > 0) {
          yield put({ type: 'USER.SET_BALANCE', payload: { balanceFormatted, balance: balance } })
        }
      }
    } else {
      // if ethereum
      // checking balance of ETH from blockchain
      const balance = yield provider.getBalance(wallet)
      const balanceFormatted = utils.formatEther(balance)
      if (Number(balanceFormatted) > 0) {
        yield put({ type: 'USER.SET_BALANCE', payload: { balanceFormatted, balance: balance } })
      }
    }

    yield put({ type: 'USER.SET_LOADING', payload: { loading: false } })
  } catch (e) {
    console.error(e)
  }
}

export default generator
generator.selectors = {
  decimals: ({ tokens: { decimals } }) => decimals,
  tokenAddress: ({ tokens: { tokenAddress } }) => tokenAddress,
  wallet: ({ user: { wallet } }) => wallet
}
