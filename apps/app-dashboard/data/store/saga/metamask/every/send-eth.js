/* global web3 */
import { put, select } from 'redux-saga/effects'
import { ethers, utils } from 'ethers'
import { factory } from 'app.config.js'
import { defineNetworkName } from 'linkdrop-commons'
import LinkdropFactory from 'contracts/LinkdropFactory.json'
import LinkdropMastercopy from 'contracts/LinkdropMastercopy.json'

const generator = function * ({ payload }) {
  try {
    yield put({ type: 'USER.SET_LOADING', payload: { loading: true } })
    const { chainId, ethAmount, account: fromWallet } = payload
    const newWallet = ethers.Wallet.createRandom()
    const { address: wallet, privateKey } = newWallet
    const networkName = defineNetworkName({ chainId })
    const provider = yield ethers.getDefaultProvider(networkName)
    const ethValueWei = utils.parseEther(String(ethAmount))
    const factoryContract = yield new ethers.Contract(factory, LinkdropFactory.abi, provider)
    const isDeployed = yield factoryContract.isDeployed(fromWallet)
    let data
    let to
    if (!isDeployed) {
      data = yield factoryContract.interface.functions.deployProxyWithSigner.encode([wallet])
      to = factory
    } else {
      const proxyAddress = yield select(generator.selectors.proxyAddress)
      const proxyContract = yield new ethers.Contract(proxyAddress, LinkdropMastercopy.abi, provider)
      data = yield proxyContract.interface.functions.addSigner.encode([wallet])
      to = proxyAddress
    }
    const promise = new Promise((resolve, reject) => {
      web3.eth.sendTransaction({ to, from: fromWallet, value: ethValueWei, data }, (err, txHash) => {
        if (err) { console.error(err); reject(err) }
        return resolve({ txHash })
      })
    })
    const { txHash } = yield promise
    yield put({ type: 'USER.SET_TX_HASH', payload: { txHash } })
    yield put({ type: 'USER.SET_LOADING', payload: { loading: false } })
    yield put({ type: 'USER.SET_PRIVATE_KEY', payload: { privateKey } })
  } catch (e) {
    console.error(e)
  }
}

export default generator
generator.selectors = {
  proxyAddress: ({ user: { proxyAddress } }) => proxyAddress
}
