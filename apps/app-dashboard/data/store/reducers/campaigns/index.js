import reducers from './reducers'

const initialState = {
  tokenAmount: null,
  tokenSymbol: null,
  ethAmount: null,
  linksAmount: null,
  links: []
}

export default (state = initialState, action = {}) => {
  const newState = { ...state }
  const { type } = action
  const actionMethod = ACTIONS[type]
  if (!actionMethod) return newState
  return actionMethod(newState, action)
}

const ACTIONS = {
  'CAMPAIGNS.SET_TOKEN_AMOUNT': reducers.setTokenAmount,
  'CAMPAIGNS.SET_TOKEN_SYMBOL': reducers.setTokenSymbol,
  'CAMPAIGNS.SET_ETH_AMOUNT': reducers.setEthAmount,
  'CAMPAIGNS.SET_LINKS_AMOUNT': reducers.setLinksAmount,
  'CAMPAIGNS.SET_LINKS': reducers.setLinks
}
