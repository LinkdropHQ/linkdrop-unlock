class Tokens {
  constructor (actions) {
    this.actions = actions
  }

  getAssets ({ account }) {
    this.actions.dispatch({ type: '*TOKENS.GET_ASSETS', payload: { account } })
  }

  getTokenERC20Data ({ tokenAddress, chainId }) {
    this.actions.dispatch({ type: '*TOKENS.GET_TOKEN_ERC20_DATA', payload: { tokenAddress, chainId } })
  }

  getTokenERC721Data ({ tokenAddress, chainId }) {
    this.actions.dispatch({ type: '*TOKENS.GET_TOKEN_ERC721_DATA', payload: { tokenAddress, chainId } })
  }

  getEthData () {
    this.actions.dispatch({ type: '*TOKENS.GET_ETH_DATA' })
  }
}

export default Tokens
