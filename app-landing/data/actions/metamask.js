class Metamask {
  constructor (actions) {
    this.actions = actions
  }

  getAssetBalance ({ chainId, tokenAddress, account }) {
    this.actions.dispatch({ type: '*MM.GET_ASSET_BALANCE', payload: { chainId, tokenAddress, account } })
  }

  checkAssetPresence ({ chainId, tokenAddress, account, tokenId }) {
    this.actions.dispatch({ type: '*MM.CHECK_ASSET_PRESENCE', payload: { chainId, tokenAddress, account, tokenId } })
  }

  getEthBalance ({ chainId, account }) {
    this.actions.dispatch({ type: '*MM.GET_ETH_BALANCE', payload: { chainId, account } })
  }

  sendTokensFromMetamask ({ currentAsset, chainId, assetAmount, ethAmount, account, tokenAddress, assetId }) {
    this.actions.dispatch({ type: '*MM.SEND_TOKENS_FROM_METAMASK', payload: { currentAsset, chainId, assetAmount, ethAmount, account, tokenAddress, assetId } })
  }
}

export default Metamask
