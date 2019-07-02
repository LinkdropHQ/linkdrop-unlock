import reducers from './reducers'

const initialState = {
  loading: false,
  step: null,
  currentAddress: null,
  chainId: null
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
  'USER.SET_CHAIN_ID': reducers.setChainId
}
