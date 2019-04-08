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
}

export default User
