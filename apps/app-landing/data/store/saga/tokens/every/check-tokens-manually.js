import { put, select } from 'redux-saga/effects'
import { ethers, utils } from 'ethers'
import TokenMock from 'contracts/TokenMock.json'
import NFTMock from 'contracts/NFTMock.json'
import { defineNetworkName } from 'linkdrop-commons'

const generator = function * ({ payload }) {
  try {
    const ethWalletContract = ethers.constants.AddressZero
    const { isERC721, chainId, tokenId } = payload
    yield put({ type: 'USER.SET_LOADING', payload: { loading: true } })
    const tokenAddress = yield select(generator.selectors.tokenAddress)
    const wallet = yield select(generator.selectors.wallet)
    const networkName = defineNetworkName({ chainId })
    const provider = yield ethers.getDefaultProvider(networkName)

    // if not ethereum
    if (ethWalletContract !== tokenAddress) {
      if (isERC721) {
        // checking balance of ERC-721 from manual check
        const nftContract = yield new ethers.Contract(tokenAddress, NFTMock.abi, provider)
        const nftContractOwner = yield nftContract.ownerOf(tokenId)
        if (nftContractOwner.toLowerCase() === wallet.toLowerCase()) {
          yield put({ type: 'TOKENS.SET_TOKEN_ID', payload: { tokenId: tokenId } })
        }
      } else {
        // checking balance of ERC-20 from blockchain by tokenAddress
        const tokenContract = yield new ethers.Contract(tokenAddress, TokenMock.abi, provider)
        const assetDecimals = yield select(generator.selectors.assetDecimals)
        const balance = yield tokenContract.balanceOf(wallet)
        const balanceFormatted = utils.formatUnits(balance, assetDecimals)
        if (Number(balanceFormatted) > 0) {
          yield put({ type: 'TOKENS.SET_ASSET_BALANCE', payload: { balanceFormatted, balance } })
        }
      }
    } else {
      // if ethereum
      // checking balance of ETH from blockchain
      const balance = yield provider.getBalance(wallet)
      const balanceFormatted = utils.formatEther(balance)
      if (Number(balanceFormatted) > 0) {
        yield put({ type: 'TOKENS.SET_BALANCE', payload: { balanceFormatted, balance } })
      }
    }

    yield put({ type: 'USER.SET_LOADING', payload: { loading: false } })
  } catch (e) {
    console.error(e)
  }
}

export default generator
generator.selectors = {
  assetDecimals: ({ tokens: { assetDecimals } }) => assetDecimals,
  tokenAddress: ({ tokens: { tokenAddress } }) => tokenAddress,
  wallet: ({ user: { wallet } }) => wallet
}
