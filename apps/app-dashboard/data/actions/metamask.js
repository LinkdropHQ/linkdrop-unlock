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

  sendErc20WithEth ({ account, ethAmount, tokenAmount }) {
    this.actions.dispatch({ type: '*METAMASK.SEND_ERC20_WITH_ETH', payload: { account, ethAmount, tokenAmount } })
  }
}

export default Metamask
