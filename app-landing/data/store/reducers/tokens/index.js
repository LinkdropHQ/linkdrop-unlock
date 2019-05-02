import reducers from './reducers'

const initialState = {
  decimals: null,
  symbol: null,
  tokenAddress: null
}

export default (state = initialState, action = {}) => {
  const newState = { ...state }
  const { type } = action
  const actionMethod = ACTIONS[type]
  if (!actionMethod) return newState

  return actionMethod(newState, action)
}

const ACTIONS = {
  'TOKENS.SET_DECIMALS': reducers.setDecimals,
  'TOKENS.SET_SYMBOL': reducers.setSymbol,
  'TOKENS.SET_TOKEN_ADDRESS': reducers.setTokenAddress
}
