class Tokens {
  constructor (actions) {
    this.actions = actions
  }

  getTokensData ({ tokenAddress, tokenType, networkId }) {
    this.actions.dispatch({ type: '*TOKENS.GET_TOKENS_DATA', payload: { tokenAddress, tokenType, networkId } })
  }

  checkTokensManually ({ isERC721, networkId, tokenId }) {
    this.actions.dispatch({ type: '*TOKENS.CHECK_TOKENS_MANUALLY', payload: { isERC721, networkId, tokenId } })
  }

  checkBalance ({ account, networkId }) {
    // checking current balance on account in network id
    this.actions.dispatch({ type: '*TOKENS.CHECK_BALANCE', payload: { account, networkId } })
  }
}

export default Tokens
