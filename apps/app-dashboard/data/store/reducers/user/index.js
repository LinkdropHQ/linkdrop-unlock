import reducers from './reducers'
const ls = window.localStorage

const initialState = {
  loading: false,
  step: null,
  currentAddress: null,
  chainId: null,
  privateKey: ls && ls.getItem && ls.getItem('privateKey'),
  txHash: null,
  transactionStatus: null,
  version: null,
  sdk: null
}

export default (state = initialState, action = {}) => {
  const newState = { ...state }
  const { type } = action
  const actionMethod = ACTIONS[type]
  if (!actionMethod) return newState
  return actionMethod(newState, action)
}

const ACTIONS = {
  'USER.SET_LOADING': reducers.setLoading,
  'USER.SET_STEP': reducers.setStep,
  'USER.SET_CURRENT_ADDRESS': reducers.setCurrentAddress,
  'USER.SET_CHAIN_ID': reducers.setChainId,
  'USER.SET_PRIVATE_KEY': reducers.setPrivateKey,
  'USER.SET_TX_HASH': reducers.setTxHash,
  'USER.SET_TRANSACTION_STATUS': reducers.setTransactionStatus,
  'USER.SET_VERSION_VAR': reducers.setVersionVar,
  'USER.SET_SDK': reducers.setSdk
}
