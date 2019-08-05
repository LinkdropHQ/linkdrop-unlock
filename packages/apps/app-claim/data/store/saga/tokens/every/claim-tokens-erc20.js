import { put, select } from 'redux-saga/effects'

const generator = function * ({ payload }) {
  try {
    const { campaignId, wallet, tokenAddress, tokenAmount, weiAmount, expirationTime, linkKey, linkdropMasterAddress, linkdropSignerSignature } = payload
    yield put({ type: 'USER.SET_LOADING', payload: { loading: true } })
    const sdk = yield select(generator.selectors.sdk)
    const { success, errors, txHash } = yield sdk.claim({
      weiAmount: weiAmount || '0',
      tokenAddress,
      tokenAmount: tokenAmount || '0',
      expirationTime,
      linkKey,
      linkdropMasterAddress,
      linkdropSignerSignature,
      receiverAddress: wallet,
      campaignId
    })

    if (success) {
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
const ERRORS = [
  'LINKDROP_PROXY_CONTRACT_PAUSED',
  'INVALID_TOKEN_ADDRESS',
  'LINK_CLAIMED',
  'LINK_CANCELED',
  'INSUFFICIENT_ETHERS',
  'INSUFFICIENT_TOKENS',
  'INSUFFICIENT_ALLOWANCE',
  'INVALID_LINKDROP_SIGNER_SIGNATURE',
  'INVALID_RECEIVER_SIGNATURE',
  'SERVER_ERROR_OCCURED'
]
