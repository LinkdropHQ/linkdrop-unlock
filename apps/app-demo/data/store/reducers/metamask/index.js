import reducers from './reducers'

const initialState = {
  mmAssetBalance: null,
  mmAssetBalanceFormatted: null,
  mmBalance: null,
  mmBalanceFormatted: null,
  mmAssetDecimals: null,
  mmAssetSymbol: null,
  mmLoading: false,
  mmStatus: 'initial',
  mmAssetIds: null
}

export default (state = initialState, action = {}) => {
  const newState = { ...state }
  const { type } = action
  const actionMethod = ACTIONS[type]
  if (!actionMethod) return newState

  return actionMethod(newState, action)
}

const ACTIONS = {
  // set decimals for metamask asset
  'MM.SET_ASSET_DECIMALS': reducers.setAssetDecimals,
  // set balance for metamask asset
  'MM.SET_ASSET_BALANCE': reducers.setAssetBalance,
  // set balance for metamask eth
  'MM.SET_BALANCE': reducers.setBalance,
  // set symbol for metamask asset
  'MM.SET_ASSET_SYMBOL': reducers.setAssetSymbol,
  // set loading for metamask
  'MM.SET_LOADING': reducers.setLoading,
  // set status
  'MM.SET_STATUS': reducers.setStatus,
  // set asset id
  'MM.SET_ASSET_IDS': reducers.setAssetIds
}
