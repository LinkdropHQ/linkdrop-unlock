import reducers from './reducers'

const initialState = {
  loading: false,
  link: ''
}

export default (state = initialState, action = {}) => {
  const newState = { ...state }
  const { type } = action
  const actionMethod = ACTIONS[type]
  if (!actionMethod) return newState

  return actionMethod(newState, action)
}

const ACTIONS = {
  'TOKENS.SET_LINK': reducers.setLink,
  'TOKENS.SET_LOADING': reducers.setLoading
}
