class Contract {
  constructor (actions) {
    this.actions = actions
  }

  getTokenData ({ tokenAddress, amount, networkId }) {
    this.actions.dispatch({ type: '*CONTRACT.GET_TOKEN_DATA', payload: { tokenAddress, amount, networkId } })
  }
}

export default Contract
