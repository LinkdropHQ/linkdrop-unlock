import reducers from './reducers'

const initialState = {
  id: undefined,
  locale: 'en',
  wallet: '0xF3B1A2704849d8524094EFFe099b67f9Cc87d0Fc',
  step: 0,
  loading: false,
  errors: []
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
  'USER.SET_ERRORS': reducers.setErrors
}
