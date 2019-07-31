/* global web3 */
import { put, select } from 'redux-saga/effects'
import LinkdropMastercopy from 'contracts/LinkdropMastercopy.json'
import { defineNetworkName } from '@linkdrop/commons'
import { ethers } from 'ethers'
const ls = (typeof window === 'undefined' ? {} : window).localStorage

const generator = function * ({ payload }) {
  try {
    const { id: proxyAddress, chainId, account } = payload
    const campaigns = yield select(generator.selectors.campaigns)
    const networkName = defineNetworkName({ chainId })
    const provider = yield ethers.getDefaultProvider(networkName)
    const proxyContract = yield new ethers.Contract(proxyAddress, LinkdropMastercopy.abi, provider)
    const gasPrice = yield provider.getGasPrice()
    const oneGwei = ethers.utils.parseUnits('1', 'gwei')
    const data = yield proxyContract.interface.functions.withdraw.encode([])
    const promise = new Promise((resolve, reject) => {
      web3.eth.sendTransaction({ to: proxyAddress, from: account, gasPrice: gasPrice.add(oneGwei), data }, (err, txHash) => {
        if (err) { console.error(err); reject(err) }
        return resolve({ txHash })
      })
    })

    const { txHash } = yield promise

    if (txHash) {
      const campaignsUpdated = campaigns.map(campaign => {
        if (campaign.id === proxyAddress) {
          campaign.loading = true
          campaign.awaitingStatus = 'canceled'
          campaign.awaitingTxHash = txHash
        }
        return campaign
      })
      const campaignsStringified = JSON.stringify(campaignsUpdated)
      ls && ls.setItem && ls.setItem('campaigns', window.btoa(campaignsStringified))
      yield put({ type: 'CAMPAIGNS.SET_ITEMS', payload: { items: campaignsUpdated } })
      yield put({ type: 'METAMASK.SET_STATUS', payload: { status: 'finished' } })
    }
  } catch (e) {
    console.error(e)
  }
}

export default generator
generator.selectors = {
  campaigns: ({ campaigns: { items: campaigns } }) => campaigns
}
