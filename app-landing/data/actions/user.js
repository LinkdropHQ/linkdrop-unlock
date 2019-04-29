class User {
  constructor (actions) {
    this.actions = actions
  }

  changeLocale ({ locale }) {
    this.actions.dispatch({ type: 'USER.CHANGE_LOCALE', payload: { locale } })
  }

  setWallet ({ wallet }) {
    this.actions.dispatch({ type: 'USER.SET_WALLET', payload: { wallet } })
  }

  setStep ({ step }) {
    this.actions.dispatch({ type: 'USER.SET_STEP', payload: { step } })
  }

  setLoading ({ loading }) {
    this.actions.dispatch({ type: 'USER.SET_LOADING', payload: { loading } })
  }

  checkBalance ({ account }) {
    this.actions.dispatch({ type: '*USER.CHECK_BALANCE', payload: { account, networkId: 4 } })
  }

  createWallet () {
    this.actions.dispatch({ type: '*USER.CREATE_WALLET' })
  }

  generateLink () {
    this.actions.dispatch({ type: '*USER.GENERATE_LINK' })
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
