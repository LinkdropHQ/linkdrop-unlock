import reducers from './reducers'
const localStorage = window.localStorage
const initialWallet = localStorage && localStorage.getItem('wallet')
const initialPrivateKey = localStorage && localStorage.getItem('privateKey')
const initialMasterAddress = localStorage && localStorage.getItem('masterAddress')

const initialState = {
  id: undefined,
  locale: 'en',
  wallet: initialWallet || null,
  step: 0,
  loading: false,
  errors: [],
  link: null,
  privateKey: initialPrivateKey || null,
  claimed: false,
  alert: null,
  masterAddress: initialMasterAddress || null
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
  'USER.SET_ERRORS': reducers.setErrors,
  'USER.SET_LINK': reducers.setLink,
  'USER.SET_PRIVATE_KEY': reducers.setPrivateKey,
  'USER.SET_CLAIMED_STATUS': reducers.setClaimedStatus,
  'USER.SET_ALERT': reducers.setAlert,
  'USER.SET_MASTER_ADDRESS': reducers.setMasterAddress
}
