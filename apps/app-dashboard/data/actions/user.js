class User {
  constructor (actions) {
    this.actions = actions
  }

  setStep ({ step }) {
    this.actions.dispatch({ type: 'USER.SET_STEP', payload: { step } })
  }

  createSigningKey () {
    this.actions.dispatch({ type: '*USER.CREATE_SIGNING_KEY' })
  }

  setCurrentAddress ({ currentAddress }) {
    this.actions.dispatch({ type: 'USER.SET_CURRENT_ADDRESS', payload: { currentAddress } })
  }

  checkCurrentProvider () {
    this.actions.dispatch({ type: '*USER.CHECK_CURRENT_PROVIDER' })
  }
}

export default User
