class User {
  constructor (actions) {
    this.actions = actions
  }

  setStep ({ step }) {
    this.actions.dispatch({ type: 'USER.SET_STEP', payload: { step } })
  }

  createSigningKey ({ chainId, account }) {
    this.actions.dispatch({ type: '*USER.CREATE_SIGNING_KEY', payload: { chainId, account } })
  }

  setCurrentAddress ({ currentAddress }) {
    this.actions.dispatch({ type: 'USER.SET_CURRENT_ADDRESS', payload: { currentAddress } })
  }

  checkCurrentProvider () {
    this.actions.dispatch({ type: '*USER.CHECK_CURRENT_PROVIDER' })
  }

  checkTxHash ({ txHash, chainId }) {
    this.actions.dispatch({ type: '*USER.CHECK_TX_HASH', payload: { txHash, chainId } })
  }

  createProxyAddress ({ currentAddress }) {
    this.actions.dispatch({ type: '*USER.CREATE_PROXY_ADDRESS', payload: { address: currentAddress } })
  }

  prepareVersionVar ({ chainId, currentAddress }) {
    this.actions.dispatch({ type: '*USER.PREPARE_VERSION_VAR', payload: { chainId, currentAddress } })
  }
}

export default User
