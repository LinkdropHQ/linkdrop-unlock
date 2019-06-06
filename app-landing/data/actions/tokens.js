class Tokens {
  constructor (actions) {
    this.actions = actions
  }

  getTokensData ({ tokenAddress, tokenType, chainId }) {
    this.actions.dispatch({ type: '*TOKENS.GET_TOKENS_DATA', payload: { tokenAddress, tokenType, chainId } })
  }

  checkTokensManually ({ isERC721, chainId, tokenId }) {
    this.actions.dispatch({ type: '*TOKENS.CHECK_TOKENS_MANUALLY', payload: { isERC721, chainId, tokenId } })
  }

  checkBalance ({ account, chainId, tokenAddress }) {
    // checking current balance on account in network id
    this.actions.dispatch({ type: '*TOKENS.CHECK_BALANCE', payload: { account, chainId, tokenAddress } })
  }

  getAssets ({ account }) {
    this.actions.dispatch({ type: '*TOKENS.GET_ASSETS', payload: { account } })
  }

  checkErc721Balance ({ account, chainId, tokenAddress, tokenId }) {
    this.actions.dispatch({ type: '*TOKENS.CHECK_ERC721_BALANCE', payload: { account, chainId, tokenAddress, tokenId } })
  }
}

export default Tokens
