class Tokens {
  constructor (actions) {
    this.actions = actions
  }

  claimTokensERC20 ({ wallet, tokenAddress, ethAmount, tokenAmount, expirationTime, linkKey, senderAddress, senderSignature }) {
    this.actions.dispatch({ type: '*TOKENS.CLAIM_TOKENS_ERC20', payload: { wallet, ethAmount, tokenAddress, tokenAmount, expirationTime, linkKey, senderAddress, senderSignature } })
  }

  claimTokensERC721 ({ wallet, nftAddress, tokenId, ethAmount, expirationTime, linkKey, senderAddress, senderSignature }) {
    this.actions.dispatch({ type: '*TOKENS.CLAIM_TOKENS_ERC721', payload: { wallet, ethAmount, nftAddress, tokenId, expirationTime, linkKey, senderAddress, senderSignature } })
  }

  checkTransactionStatus ({ transactionId, networkId }) {
    this.actions.dispatch({ type: '*TOKENS.CHECK_TRANSACTION_STATUS', payload: { transactionId, networkId } })
  }

  checkIfClaimed ({ linkKey, networkId, senderAddress }) {
    this.actions.dispatch({ type: '*TOKENS.CHECK_IF_CLAIMED', payload: { linkKey, networkId, senderAddress } })
  }
}

export default Tokens
