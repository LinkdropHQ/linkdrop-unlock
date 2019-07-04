import { put, select } from 'redux-saga/effects'
import { ethers } from 'ethers'
import LinkdropFactory from 'contracts/LinkdropFactory.json'
import { factory, jsonRpcUrl } from 'app.config.js'
import { defineNetworkName } from 'linkdrop-commons'

const generator = function * ({ payload }) {
  try {
    const startToGetVersion = +(new Date())
    const { chainId, currentAddress } = payload
    const privateKey = yield select(generator.selectors.privateKey)
    const networkName = defineNetworkName({ chainId })
    const provider = yield ethers.getDefaultProvider(networkName)
    const factoryContract = yield new ethers.Contract(factory, LinkdropFactory.abi, provider)
    const version = yield factoryContract.getProxyMasterCopyVersion(currentAddress)
    const providerJsonRpcProvider = new ethers.providers.JsonRpcProvider(jsonRpcUrl)
    const linkdropSigner = new ethers.Wallet(privateKey, provider)
    yield put({ type: 'USER.SET_PROVIDER', payload: { provider: providerJsonRpcProvider } })
    yield put({ type: 'USER.SET_LINKDROP_SIGNER', payload: { linkdropSigner } })
    yield put({ type: 'USER.SET_VERSION_VAR', payload: { version } })
    console.log('version was defined for: ', `${+(new Date()) - startToGetVersion} ms`)
  } catch (e) {
    console.error(e)
  }
}

export default generator
generator.selectors = {
  privateKey: ({ user: { privateKey } }) => privateKey
}
