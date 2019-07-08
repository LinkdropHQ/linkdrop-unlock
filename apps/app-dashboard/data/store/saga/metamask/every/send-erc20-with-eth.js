/* global web3 */

import { put, select } from 'redux-saga/effects'
import { utils } from 'ethers'
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
    const { tokenAmount, account: fromWallet, ethAmount } = payload
    const ethValueWei = ethAmount ? utils.parseEther(String(ethAmount)) : 0
    const tokenAddress = yield select(generator.selectors.address)
    const tokenContract = yield web3Obj.eth.contract(TokenMock.abi).at(tokenAddress)
    const tokenDecimals = yield select(generator.selectors.decimals)
    const proxyAddress = yield select(generator.selectors.proxyAddress)
    const balanceFormatted = utils.formatUnits(String(tokenAmount), tokenDecimals)
    const approveData = yield tokenContract.approve.getData(proxyAddress, balanceFormatted, { from: fromWallet })
    const promiseErc20 = new Promise((resolve, reject) => {
      web3Obj.eth.sendTransaction({ to: tokenAddress, from: fromWallet, value: 0, data: approveData }, result => resolve({ result }))
    })
    const { result: resultErc20 } = yield promiseErc20
    const promiseEth = new Promise((resolve, reject) => {
      web3Obj.eth.sendTransaction({ to: proxyAddress, gas: 73000, from: fromWallet, value: ethValueWei }, result => resolve({ result }))
    })
    const { result: resultEth } = yield promiseEth
    if (String(resultErc20) === 'null' && String(resultEth) === 'null') {
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
