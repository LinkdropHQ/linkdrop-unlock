class Campaign {
  constructor (actions) {
    this.actions = actions
  }

  prepareNewTokensData ({ tokenAmount, ethAmount, linksAmount, tokenSymbol }) {
    this.actions.dispatch({
      type: '*CAMPAIGNS.PREPARE_NEW_TOKENS_DATA',
      payload: {
        tokenAmount,
        ethAmount,
        linksAmount,
        tokenSymbol
      }
    })
  }

  prepareNewEthData ({ ethAmount, linksAmount, tokenSymbol }) {
    this.actions.dispatch({
      type: '*CAMPAIGNS.PREPARE_NEW_ETH_DATA',
      payload: {
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
