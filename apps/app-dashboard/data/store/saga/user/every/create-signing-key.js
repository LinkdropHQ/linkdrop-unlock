/* global web3 */
import { put } from 'redux-saga/effects'
import { ethers } from 'ethers'
const localStorage = (typeof window === 'undefined' ? {} : window).localStorage

const generator = function * ({ payload }) {
  try {
    const provider = new ethers.providers.Web3Provider(web3.currentProvider)
    const signingKey = yield provider.getSigner()
    console.log({ signingKey })
    localStorage && localStorage.setItem('signingKey', signingKey)
  } catch (e) {
    console.error(e)
  }
}

export default generator
generator.selectors = {
  step: ({ user: { step } }) => step
}
