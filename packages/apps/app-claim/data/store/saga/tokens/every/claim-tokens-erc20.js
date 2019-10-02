import { put, select } from 'redux-saga/effects'
import { ERRORS } from './data'
import registerWithUnlock from 'data/api/register-with-unlock'
import { getHashVariables } from '@linkdrop/commons'

const generator = function * ({ payload }) {
  try {
    const { campaignId, wallet, tokenAddress, tokenAmount, weiAmount, expirationTime, linkKey, linkdropMasterAddress, linkdropSignerSignature, lock } = payload    
    yield put({ type: 'USER.SET_LOADING', payload: { loading: true } })
    const sdk = yield select(generator.selectors.sdk)

    let { success, errors, txHash, txData, relayerAddress } = yield sdk.claimUnlock({
      weiAmount: weiAmount || '0',
      tokenAddress,
      tokenAmount: tokenAmount || '0',
      expirationTime,
      linkKey,
      linkdropMasterAddress,
      linkdropSignerSignature,
      receiverAddress: wallet,
      campaignId,
      lock
    })

    // console.log({ success, errors, txHash, txData })

    txHash = '0x9fb20b3b33c20323645b4d12f93069db311cbefe74b8c15ec6b346176aefb7b6'
    // const relayerAddress = '0xd54f7e7ddc18a8354fe29506f609d46a662e8a76'
    // const success = true
    // const errors = []
    
    
    if (success) {
      const { chainId } = getHashVariables()
      const data = yield registerWithUnlock({
        transactionHash: txHash,
        chain: chainId,
        sender: relayerAddress.toLowerCase(),
        recipient: lock,
        for_: wallet,
        txData: `0xf6e4641f000000000000000000000000${wallet.slice(2).toLowerCase()}`
      })
      console.log({ data })
      yield put({ type: 'TOKENS.SET_TRANSACTION_ID', payload: { transactionId: txHash } })
    } else {
      if (errors.length > 0) {
        const currentError = ERRORS.indexOf(errors[0])
        yield put({ type: 'USER.SET_ERRORS', payload: { errors: [currentError > -1 ? errors[0] : 'SERVER_ERROR_OCCURED'] } })
      }
    }
    yield put({ type: 'USER.SET_LOADING', payload: { loading: false } })
  } catch (error) {
    const { response: { data: { errors = [] } = {} } = {} } = error
    if (errors.length > 0) {
      const currentError = ERRORS.indexOf(errors[0])
      yield put({ type: 'USER.SET_ERRORS', payload: { errors: [currentError > -1 ? errors[0] : 'SERVER_ERROR_OCCURED'] } })
    }
  }
}

export default generator
generator.selectors = {
  sdk: ({ user: { sdk } }) => sdk
}
