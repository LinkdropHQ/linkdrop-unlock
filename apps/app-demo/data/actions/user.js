class User {
  constructor (actions) {
    this.actions = actions
  }

  changeLocale ({ locale }) {
    // change the locale
    this.actions.dispatch({ type: 'USER.CHANGE_LOCALE', payload: { locale } })
  }

  setWallet ({ wallet }) {
    // set wallet
    this.actions.dispatch({ type: 'USER.SET_WALLET', payload: { wallet } })
  }

  setStep ({ step }) {
    // set current step of link share flow
    this.actions.dispatch({ type: 'USER.SET_STEP', payload: { step } })
  }

  setLoading ({ loading }) {
    // set loading state
    this.actions.dispatch({ type: 'USER.SET_LOADING', payload: { loading } })
  }

  createWallet ({ account }) {
    // create new wallet and then create proxy address
    this.actions.dispatch({ type: '*USER.CREATE_WALLET', payload: { account } })
  }

  generateERC20Link ({ chainId }) {
    // generate new link with sdk for erc-20
    this.actions.dispatch({ type: '*USER.GENERATE_LINK_ERC20', payload: { chainId } })
  }

  generateERC20Web3Link ({ chainId, provider }) {
    // generate new link with sdk for erc-20 and web3
    this.actions.dispatch({ type: '*USER.GENERATE_LINK_ERC20_WEB3', payload: { chainId, provider } })
  }

  generateERC721Link ({ chainId }) {
    // generate new link with sdk for erc-721
    this.actions.dispatch({ type: '*USER.GENERATE_LINK_ERC721', payload: { chainId } })
  }

  generateERC721Web3Link ({ chainId, provider }) {
    // generate new link with sdk for erc-20 and web3
    this.actions.dispatch({ type: '*USER.GENERATE_LINK_ERC721_WEB3', payload: { chainId, provider } })
  }

  setAlert ({ alert }) {
    this.actions.dispatch({ type: 'USER.SET_ALERT', payload: { alert } })
  }
}

export default User
