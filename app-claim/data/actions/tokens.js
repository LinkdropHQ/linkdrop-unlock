class Tokens {
  constructor (actions) {
    this.actions = actions
  }

  claimTokens ({ wallet, token, tokenAmount: amount, expirationTime }) {
    this.actions.dispatch({ type: '*TOKENS.CLAIM_TOKENS', payload: { wallet, token, tokenAmount: amount, expirationTime } })
  }
}

export default Tokens
