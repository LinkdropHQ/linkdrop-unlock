class Tokens {
  constructor (actions) {
    this.actions = actions
  }

  createLink ({ amount, currency }) {
    this.actions.dispatch({ type: '*TOKENS.CREATE_LINK', payload: { amount, currency } })
  }
}

export default Tokens
