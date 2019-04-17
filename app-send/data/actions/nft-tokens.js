class User {
  constructor (actions) {
    this.actions = actions
  }

  getTokens ({ wallet }) {
    this.actions.dispatch({ type: '*NFT_TOKENS.GET_TOKENS', payload: { wallet } })
  }
}

export default User
