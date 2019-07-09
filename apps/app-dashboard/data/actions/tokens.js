class Tokens {
  constructor (actions) {
    this.actions = actions
  }

  getAssets ({ account }) {
    this.actions.dispatch({ type: '*TOKENS.GET_ASSETS', payload: { account } })
  }

  getTokenERC20Data ({ tokenAddress, chainId }) {
    this.actions.dispatch({ type: '*TOKENS.GET_ERC20_DATA', payload: { tokenAddress, chainId } })
  }

  getTokenERC721Data ({ tokenAddress, chainId }) {
    this.actions.dispatch({ type: '*TOKENS.GET_ERC721_DATA', payload: { tokenAddress, chainId } })
  }

  getEthData () {
    this.actions.dispatch({ type: '*TOKENS.GET_ETH_DATA' })
  }

  getEthBalance ({ account, chainId }) {
    this.actions.dispatch({ type: '*TOKENS.GET_ETH_BALANCE', payload: { account, chainId } })
  }

  getERC20Balance ({ chainId, tokenAddress, account, currentAddress }) {
    this.actions.dispatch({ type: '*TOKENS.GET_ERC20_BALANCE', payload: { chainId, tokenAddress, account, currentAddress } })
  }

  generateERC20Link ({ chainId, currentAddress }) {
    this.actions.dispatch({ type: '*TOKENS.GENERATE_ERC20_LINK', payload: { chainId, currentAddress } })
  }

  generateETHLink ({ chainId, currentAddress }) {
    this.actions.dispatch({ type: '*TOKENS.GENERATE_ETH_LINK', payload: { chainId, currentAddress } })
  }
}

export default Tokens
