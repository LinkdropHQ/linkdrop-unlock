class Contract {
  constructor (actions) {
    this.actions = actions
  }

  getTokenERC20Data ({ tokenAddress, amount, networkId }) {
    this.actions.dispatch({ type: '*CONTRACT.GET_TOKEN_ERC20_DATA', payload: { tokenAddress, amount, networkId } })
  }

  getTokenERC721Data ({ nft, tokenId, networkId }) {
    this.actions.dispatch({ type: '*CONTRACT.GET_TOKEN_ERC721_DATA', payload: { nft, tokenId, networkId } })
  }
}

export default Contract
