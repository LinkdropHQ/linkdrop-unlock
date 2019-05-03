import { getHashVariables } from 'linkdrop-commons'
const { n = '1' } = getHashVariables()

class Tokens {
  constructor (actions) {
    this.actions = actions
  }

  getTokensData ({ tokenAddress, isERC721 }) {
    this.actions.dispatch({ type: '*TOKENS.GET_TOKENS_DATA', payload: { tokenAddress, isERC721 } })
  }

  checkTokensManually ({ isERC721 }) {
    this.actions.dispatch({ type: '*TOKENS.CHECK_TOKENS_MANUALLY', payload: { isERC721 } })
  }

  checkBalance ({ account }) {
    // checking current balance on account in network id
    this.actions.dispatch({ type: '*TOKENS.CHECK_BALANCE', payload: { account, networkId: n } })
  }
}

export default Tokens
