import reducers from './reducers'
const ls = (typeof window === 'undefined' ? {} : window).localStorage
const campaigns = ls && ls.getItem && ls.getItem('campaigns')
const campaignsDecoded = campaigns ? JSON.parse(window.atob(campaigns)) : []
const initialState = {
  tokenAmount: null,
  tokenSymbol: null,
  ethAmount: null,
  linksAmount: null,
  tokenType: 'bloblo',
  date: null,
  links: [],
  items: campaignsDecoded,
  current: null
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
  'CAMPAIGNS.SET_LINKS': reducers.setLinks,
  'CAMPAIGNS.SET_TOKEN_TYPE': reducers.setTokenType,
  'CAMPAIGNS.SET_DATE': reducers.setDate,
  'CAMPAIGNS.SET_ITEMS': reducers.setItems,
  'CAMPAIGNS.SET_CURRENT': reducers.setCurrent
}
