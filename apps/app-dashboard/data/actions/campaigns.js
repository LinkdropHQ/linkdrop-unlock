class Campaign {
  constructor (actions) {
    this.actions = actions
  }

  prepareNew ({ tokenAmount, ethAmount, linksAmount, tokenSymbol }) {
    this.actions.dispatch({
      type: '*CAMPAIGNS.PREPARE_NEW',
      payload: {
        tokenAmount,
        ethAmount,
        linksAmount,
        tokenSymbol
      }
    })
  }

  proceedPayment ({ cardNumber }) {
    this.actions.dispatch({
      type: '*CAMPAIGNS.PROCEED_PAYMENT',
      payload: {
        cardNumber
      }
    })
  }
}

export default Campaign
