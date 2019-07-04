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

  getEthBalance ({ account, chainId }) {
    this.actions.dispatch({ type: '*TOKENS.GET_ETH_BALANCE', payload: { account, chainId } })
  }

  generateERC20Link ({ chainId, currentAddress }) {
    this.actions.dispatch({ type: '*TOKENS.GENERATE_ERC20_LINK', payload: { chainId, currentAddress } })
  }
}

export default Tokens
