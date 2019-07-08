import { put } from 'redux-saga/effects'
import { ethers } from 'ethers'
import LinkdropFactory from 'contracts/LinkdropFactory.json'
import { factory } from 'app.config.js'
import { defineNetworkName } from 'linkdrop-commons'

const generator = function * ({ payload }) {
  try {
    const { chainId, currentAddress } = payload
    const networkName = defineNetworkName({ chainId })
    const provider = yield ethers.getDefaultProvider(networkName)
    const factoryContract = yield new ethers.Contract(factory, LinkdropFactory.abi, provider)
    const version = yield factoryContract.getProxyMasterCopyVersion(currentAddress)
    yield put({ type: 'USER.SET_VERSION_VAR', payload: { version } })
  } catch (e) {
    console.error(e)
  }
}

export default generator
