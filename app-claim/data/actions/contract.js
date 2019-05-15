class Contract {
  constructor (actions) {
    this.actions = actions
  }

  getTokenERC20Data ({ tokenAddress, tokenAmount, ethAmount, networkId }) {
    this.actions.dispatch({ type: '*CONTRACT.GET_TOKEN_ERC20_DATA', payload: { tokenAddress, tokenAmount, ethAmount, networkId } })
  }

  getTokenERC721Data ({ nftAddress, tokenId, networkId }) {
    this.actions.dispatch({ type: '*CONTRACT.GET_TOKEN_ERC721_DATA', payload: { nftAddress, tokenId, networkId } })
  }
}

export default Contract
