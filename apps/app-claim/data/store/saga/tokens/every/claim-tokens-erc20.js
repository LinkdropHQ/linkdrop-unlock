import { put } from 'redux-saga/effects'
import { jsonRpcUrl, factory, apiHost } from 'config'
import LinkdropSDK from 'sdk/src/index'
import { ethers } from 'ethers'
import { defineNetworkName } from 'linkdrop-commons'
import LinkdropFactory from 'contracts/LinkdropFactory.json'

const generator = function * ({ payload }) {
  try {
    const { wallet, tokenAddress, chainId, tokenAmount, weiAmount, expirationTime, linkKey, linkdropMasterAddress, linkdropSignerSignature } = payload
    yield put({ type: 'USER.SET_LOADING', payload: { loading: true } })
    const ethersContractZeroAddress = ethers.constants.AddressZero
    const networkName = defineNetworkName({ chainId })
    const provider = yield ethers.getDefaultProvider(networkName)
    const factoryContract = yield new ethers.Contract(factory, LinkdropFactory.abi, provider)
    const version = yield factoryContract.getProxyMasterCopyVersion(linkdropMasterAddress)
    const { success, txHash, error: { reason = [] } = {} } = yield LinkdropSDK.claim({
      jsonRpcUrl,
      host: apiHost,
      weiAmount: tokenAddress === ethersContractZeroAddress ? weiAmount : '0',
      tokenAddress,
      tokenAmount: tokenAddress === ethersContractZeroAddress ? '0' : tokenAmount,
      expirationTime,
      linkKey,
      linkdropMasterAddress,
      linkdropSignerSignature,
      receiverAddress: wallet,
      isApprove: false,
      chainId,
      version: version.toNumber()
    })

    if (success) {
      yield put({ type: 'TOKENS.SET_TRANSACTION_ID', payload: { transactionId: txHash } })
    } else {
      if (reason.length > 0) {
        if (reason[0] === 'Insufficient amount of eth') {
          yield put({ type: 'USER.SET_ERRORS', payload: { errors: ['LINK_FAILED'] } })
        }
      }
    }
    yield put({ type: 'USER.SET_LOADING', payload: { loading: false } })
  } catch (e) {
    console.error(e)
  }
}

export default generator

generator.selectors = {
  wallet: ({ user: { wallet } }) => wallet
}
