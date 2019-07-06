/* global web3 */

import { put, select } from 'redux-saga/effects'
import { utils } from 'ethers'
import { mocks } from 'linkdrop-commons'

let web3Obj
try {
  web3Obj = web3
} catch (e) {
  web3Obj = new mocks.Web3Mock()
}
const generator = function * ({ payload }) {
  try {
    yield put({ type: 'METAMASK.SET_STATUS', payload: { status: 'initial' } })
    const { ethAmount, account: fromWallet } = payload
    const proxyAddress = yield select(generator.selectors.proxyAddress)
    const ethValueWei = utils.parseEther(String(ethAmount))
    const promise = new Promise((resolve, reject) => {
      web3Obj.eth.sendTransaction({ to: proxyAddress, gas: 73000, from: fromWallet, value: ethValueWei }, result => resolve({ result }))
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
  proxyAddress: ({ user: { proxyAddress } }) => proxyAddress
}
