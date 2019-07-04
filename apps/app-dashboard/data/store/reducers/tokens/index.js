import reducers from './reducers'

const initialState = {
  assets: [],
  symbol: null,
  decimals: null,
  standard: null,
  address: null,
  ethBalanceFormatted: null
}

export default (state = initialState, action = {}) => {
  const newState = { ...state }
  const { type } = action
  const actionMethod = ACTIONS[type]
  if (!actionMethod) return newState

  return actionMethod(newState, action)
}

const ACTIONS = {
  'TOKENS.SET_ASSETS': reducers.setAssets,
  'TOKENS.SET_TOKEN_SYMBOL': reducers.setTokenSymbol,
  'TOKENS.SET_TOKEN_ADDRESS': reducers.setTokenAddress,
  'TOKENS.SET_TOKEN_STANDARD': reducers.setTokenStandard,
  'TOKENS.SET_TOKEN_DECIMALS': reducers.setTokenDecimlas,
  'TOKENS.SET_ETH_BALANCE': reducers.setEthBalance
}
