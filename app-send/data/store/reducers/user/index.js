import reducers from './reducers'

const TRANSFERS = [
  {
    amount: 0.00002,
    currency: 'ETH',
    status: 'claimed',
    link: 'https://etherscan.io/tx/0xc0ef659df9b0816c2cdf8b6e0403d8329898bd27df3d318d3c790e9b0d6664ff'
  }, {
    amount: 0.01,
    currency: 'DAI',
    status: 'canceled',
    link: 'https://etherscan.io/tx/0xa31a3bc360dc0df978ec4f3a0a0f5a55ef9724d03985e37188de225645cae2e1'
  }, {
    amount: 1,
    currency: 'NFT',
    link: 'https://etherscan.io/tx/0x95e0678801a8cdbf65104c38b0f409aa5116478dc0832a2cafdd096891c0932f'
  }
]

const initialState = {
  id: undefined,
  locale: 'en',
  wallet: undefined,
  transfers: TRANSFERS
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
  'USER.SET_WALLET': reducers.setWallet
}
