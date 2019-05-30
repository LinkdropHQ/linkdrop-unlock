import reducers from './reducers'

const initialState = {
  decimals: null,
  assetDecimals: null,
  symbol: null,
  tokenAddress: null,
  standard: null,
  tokenId: null,
  assets: [],
  assetBalance: null,
  assetBalanceFormatted: null,
  balance: null,
  balanceFormatted: null
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
  'TOKENS.SET_ASSET_DECIMALS': reducers.setAssetDecimals,
  'TOKENS.SET_SYMBOL': reducers.setSymbol,
  'TOKENS.SET_TOKEN_ADDRESS': reducers.setTokenAddress,
  'TOKENS.SET_TOKEN_STANDARD': reducers.setTokenStandard,
  'TOKENS.SET_TOKEN_ID': reducers.setTokenId,
  'TOKENS.SET_ASSETS': reducers.setAssets,
  'TOKENS.SET_ASSET_BALANCE': reducers.setAssetBalance,
  'TOKENS.SET_BALANCE': reducers.setBalance
}
