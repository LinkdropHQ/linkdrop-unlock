import config from 'config'

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

  checkBalance ({ account }) {
    // checking current balance on account in network id
    this.actions.dispatch({ type: '*USER.CHECK_BALANCE', payload: { account, networkId: config.networkId } })
  }

  checkBalanceClaimed ({ account }) {
    // checking that balance was claimed by other user
    this.actions.dispatch({ type: '*USER.CHECK_BALANCE_CLAIMED', payload: { account, networkId: config.networkId } })
  }

  createWallet () {
    // create new wallet and then create proxy address
    this.actions.dispatch({ type: '*USER.CREATE_WALLET' })
  }

  generateLink () {
    // generate new link with sdk
    this.actions.dispatch({ type: '*USER.GENERATE_LINK' })
  }

  emptyAllData () {
    // empty all data to show initial screen
    this.actions.dispatch({
      type: 'USER.SET_ALL_DATA',
      payload: {
        step: 0,
        claimed: false,
        balanceFormatted: null,
        balance: null,
        link: null,
        privateKey: null,
        wallet: null,
        errors: [],
        loading: false
      }
    })
  }

  testClaimTokens ({
    amount,
    expirationTime,
    linkKey,
    n,
    senderAddress,
    senderSignature,
    token
  }) {
    // just for testing that sdk works good
    this.actions.dispatch({
      type: '*USER.TEST_CLAIM_TOKENS',
      payload: {
        amount,
        expirationTime,
        linkKey,
        n,
        senderAddress,
        senderSignature,
        token
      }
    })
  }
}

export default User
