class Metamask {
  constructor (actions) {
    this.actions = actions
  }

  sendEth ({ ethAmount, account }) {
    this.actions.dispatch({ type: '*METAMASK.SEND_ETH', payload: { ethAmount, account } })
  }

  sendErc20 ({ tokenAmount, account }) {
    this.actions.dispatch({ type: '*METAMASK.SEND_ERC20', payload: { account, tokenAmount } })
  }
}

export default Metamask
