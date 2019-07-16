/* global web3 */

import { put, select } from 'redux-saga/effects'
import { mocks } from 'linkdrop-commons'
import TokenMock from 'contracts/TokenMock.json'

let web3Obj
try {
  web3Obj = web3
} catch (e) {
  web3Obj = new mocks.Web3Mock()
}
const generator = function * ({ payload }) {
  try {
    yield put({ type: 'METAMASK.SET_STATUS', payload: { status: 'initial' } })
    const { tokenAmount, account: fromWallet } = payload
    const tokenAddress = yield select(generator.selectors.address)
    const tokenContract = yield web3Obj.eth.contract(TokenMock.abi).at(tokenAddress)
    const proxyAddress = yield select(generator.selectors.proxyAddress)
    const approveData = yield tokenContract.approve.getData(proxyAddress, Number(tokenAmount), { from: fromWallet })
    const promise = new Promise((resolve, reject) => {
      web3Obj.eth.sendTransaction({ to: tokenAddress, from: fromWallet, value: 0, data: approveData }, result => resolve({ result }))
    })
    const { result } = yield promise
    if (String(result) === 'null') {
      yield put({ type: 'METAMASK.SET_STATUS', payload: { status: 'finished' } })
    }
  } catch (e) {
    console.error(e)
  }
}

export default generator
generator.selectors = {
  proxyAddress: ({ user: { proxyAddress } }) => proxyAddress,
  address: ({ tokens: { address } }) => address,
  decimals: ({ tokens: { decimals } }) => decimals
}
