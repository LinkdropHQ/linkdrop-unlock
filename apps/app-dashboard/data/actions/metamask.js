class Metamask {
  constructor (actions) {
    this.actions = actions
  }

  sendEth ({ ethAmount, account }) {
    this.actions.dispatch({ type: '*METAMASK.SEND_ETH', payload: { ethAmount, account } })
  }
}

export default Metamask
