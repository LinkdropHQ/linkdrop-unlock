/* global web3 */

import { put, select } from 'redux-saga/effects'
import { ethers, utils } from 'ethers'
import TokenMock from 'contracts/TokenMock.json'
import { mocks } from 'linkdrop-commons'
import NFTMock from 'contracts/NFTMock.json'

let web3Obj
try {
  web3Obj = web3
} catch (e) {
  web3Obj = new mocks.Web3Mock()
}
const generator = function * ({ payload }) {
  try {
    yield put({ type: 'MM.SET_STATUS', payload: { status: 'initial' } })
    const { currentAsset, ethAmount, account: fromWallet, tokenAddress, assetAmount, assetId } = payload
    const toWallet = yield select(generator.selectors.wallet)
    if (currentAsset === ethers.constants.AddressZero) {
      const ethValueWei = utils.parseEther(ethAmount)
      const promise = new Promise((resolve, reject) => {
        web3Obj.eth.sendTransaction({ to: toWallet, gas: 23000, from: fromWallet, value: ethValueWei }, result => resolve({ result }))
      })
      const { result } = yield promise
      if (String(result) === 'null') {
        yield put({ type: 'MM.SET_STATUS', payload: { status: 'finished' } })
      }
    } else {
      let transferData
      if (currentAsset === 'erc721') {
        const tokenContract = yield web3Obj.eth.contract(NFTMock.abi).at(tokenAddress)
        transferData = yield tokenContract.transferFrom.getData(fromWallet, toWallet, assetId)
      } else {
        yield put({ type: 'TOKENS.SET_TOKEN_ADDRESS', payload: { tokenAddress } })
        const tokenContract = yield web3Obj.eth.contract(TokenMock.abi).at(tokenAddress)
        const assetDecimals = yield select(generator.selectors.assetDecimals)
        const balanceFormatted = utils.formatUnits(assetAmount, assetDecimals)
        transferData = yield tokenContract.transfer.getData(toWallet, balanceFormatted, { from: fromWallet })
      }
      const promise = new Promise((resolve, reject) => {
        web3Obj.eth.sendTransaction({ to: tokenAddress, from: fromWallet, value: 0, data: transferData }, result => resolve({ result }))
      })
      const { result } = yield promise
      if (String(result) === 'null') {
        yield put({ type: 'MM.SET_STATUS', payload: { status: 'finished' } })
      }
    }
  } catch (e) {
    console.error(e)
  }
}

export default generator
generator.selectors = {
  wallet: ({ user: { wallet } }) => wallet,
  assetDecimals: ({ metamask: { mmAssetDecimals } }) => mmAssetDecimals
}
// from - String|Number: The address for the sending account. Uses the web3.eth.defaultAccount property, if not specified. Or an address or index of a local wallet in web3.eth.accounts.wallet.
// to - String: (optional) The destination address of the message, left undefined for a contract-creation transaction.
// value - Number|String|BN|BigNumber: (optional) The value transferred for the transaction in wei, also the endowment if it’s a contract-creation transaction.
