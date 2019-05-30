class Metamask {
  constructor (actions) {
    this.actions = actions
  }

  getAssetBalance ({ networkId, tokenAddress, account }) {
    this.actions.dispatch({ type: '*MM.GET_ASSET_BALANCE', payload: { networkId, tokenAddress, account } })
  }

  getEthBalance ({ networkId, account }) {
    this.actions.dispatch({ type: '*MM.GET_ETH_BALANCE', payload: { networkId, account } })
  }

  sendTokensFromMetamask ({ currentAsset, networkId, assetAmount, ethAmount, account, tokenAddress }) {
    this.actions.dispatch({ type: '*MM.SEND_TOKENS_FROM_METAMASK', payload: { currentAsset, networkId, assetAmount, ethAmount, account, tokenAddress } })
  }
}

export default Metamask
