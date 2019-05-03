class Tokens {
  constructor (actions) {
    this.actions = actions
  }

  claimTokensERC20 ({ wallet, token, tokenAmount: amount, expirationTime, linkKey, senderAddress, senderSignature }) {
    this.actions.dispatch({ type: '*TOKENS.CLAIM_TOKENS_ERC20', payload: { wallet, token, tokenAmount: amount, expirationTime, linkKey, senderAddress, senderSignature } })
  }

  claimTokensERC721 ({ wallet, nft, tokenId, expirationTime, linkKey, senderAddress, senderSignature }) {
    this.actions.dispatch({ type: '*TOKENS.CLAIM_TOKENS_ERC721', payload: { wallet, nft, tokenId, expirationTime, linkKey, senderAddress, senderSignature } })
  }

  checkTransactionStatus ({ transactionId, networkId }) {
    this.actions.dispatch({ type: '*TOKENS.CHECK_TRANSACTION_STATUS', payload: { transactionId, networkId } })
  }
}

export default Tokens
