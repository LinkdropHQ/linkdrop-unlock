class Tokens {
  constructor (actions) {
    this.actions = actions
  }

  claimTokens () {
    this.actions.dispatch({ type: '*TOKENS.CLAIM_TOKENS', payload: {} })
  }
}

export default Tokens
