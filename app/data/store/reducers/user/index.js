import reducers from './reducers'

const initialState = {
  id: undefined,
  locale: 'en',
  wallet: '0x6C0F58AD4eb24da5769412Bf34dDEe698c4d185b'
}

export default (state = initialState, action = {}) => {
  const newState = { ...state }
  const { type } = action
  const actionMethod = ACTIONS[type]
  if (!actionMethod) return newState

  return actionMethod(newState, action)
}

const ACTIONS = {
  'USER.CHANGE_LOCALE': reducers.changeLocale
}
