import reducers from './reducers'

const initialState = {
  id: undefined,
  locale: 'en',
  wallet: undefined,
  step: 0,
  loading: false,
  transactionId: null,
  errors: [],
  walletType: null
}

export default (state = initialState, action = {}) => {
  const newState = { ...state }
  const { type } = action
  const actionMethod = ACTIONS[type]
  if (!actionMethod) return newState

  return actionMethod(newState, action)
}

const ACTIONS = {
  'USER.CHANGE_LOCALE': reducers.changeLocale,
  'USER.SET_WALLET': reducers.setWallet,
  'USER.SET_STEP': reducers.setStep,
  'USER.SET_LOADING': reducers.setLoading,
  'USER.SET_TRANSACTION_ID': reducers.setTransactionId,
  'USER.SET_ERRORS': reducers.setErrors,
  'USER.SET_WALLET_TYPE': reducers.setWalletType
}

// walletType:
// trust - default
// opera
// coinbase
// status
