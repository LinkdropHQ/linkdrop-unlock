class Campaign {
  constructor (actions) {
    this.actions = actions
  }

  prepareNewERC20Data ({ tokenAmount, ethAmount, linksAmount, tokenSymbol }) {
    this.actions.dispatch({
      type: '*CAMPAIGNS.PREPARE_NEW_ERC20_DATA',
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

  save ({ links }) {
    this.actions.dispatch({
      type: '*CAMPAIGNS.SAVE',
      payload: {
        links
      }
    })
  }

  getCSV ({ links }) {
    this.actions.dispatch({
      type: '*CAMPAIGNS.GET_CSV',
      payload: {
        links
      }
    })
  }
}

export default Campaign
