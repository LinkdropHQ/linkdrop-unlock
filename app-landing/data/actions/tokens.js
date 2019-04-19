class Tokens {
  constructor (actions) {
    this.actions = actions
  }

  setAmount ({ amount }) {
    this.actions.dispatch({ type: 'TOKENS.SET_AMOUNT', payload: { amount } })
  }
}

export default Tokens
