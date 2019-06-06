class Metamask {
  constructor (actions) {
    this.actions = actions
  }

  getAssetBalance ({ networkId, tokenAddress, account }) {
    this.actions.dispatch({ type: '*MM.GET_ASSET_BALANCE', payload: { networkId, tokenAddress, account } })
  }

  checkAssetPresence ({ networkId, tokenAddress, account, tokenId }) {
    this.actions.dispatch({ type: '*MM.CHECK_ASSET_PRESENCE', payload: { networkId, tokenAddress, account, tokenId } })
  }

  getEthBalance ({ networkId, account }) {
    this.actions.dispatch({ type: '*MM.GET_ETH_BALANCE', payload: { networkId, account } })
  }

  sendTokensFromMetamask ({ currentAsset, networkId, assetAmount, ethAmount, account, tokenAddress, assetId }) {
    this.actions.dispatch({ type: '*MM.SEND_TOKENS_FROM_METAMASK', payload: { currentAsset, networkId, assetAmount, ethAmount, account, tokenAddress, assetId } })
  }
}

export default Metamask
