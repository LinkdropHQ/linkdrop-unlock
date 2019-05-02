import { getHashVariables } from 'linkdrop-commons'
const { n = '1' } = getHashVariables()

class Tokens {
  constructor (actions) {
    this.actions = actions
  }

  getTokensData ({ tokenAddress }) {
    this.actions.dispatch({ type: '*TOKENS.GET_TOKENS_DATA', payload: { tokenAddress } })
  }

  checkTokensManually () {
    this.actions.dispatch({ type: '*TOKENS.CHECK_TOKENS_MANUALLY' })
  }

  checkBalance ({ account }) {
    // checking current balance on account in network id
    this.actions.dispatch({ type: '*TOKENS.CHECK_BALANCE', payload: { account, networkId: n } })
  }

  checkBalanceClaimed ({ account }) {
    // checking that balance was claimed by other user
    this.actions.dispatch({ type: '*TOKENS.CHECK_BALANCE_CLAIMED', payload: { account, networkId: n } })
  }

  testClaimTokens ({
    amount,
    expirationTime,
    linkKey,
    n,
    senderAddress,
    senderSignature,
    token
  }) {
    // just for testing that sdk works good
    this.actions.dispatch({
      type: '*TOKENS.TEST_CLAIM_TOKENS',
      payload: {
        amount,
        expirationTime,
        linkKey,
        n,
        senderAddress,
        senderSignature,
        token
      }
    })
  }
}

export default Tokens
