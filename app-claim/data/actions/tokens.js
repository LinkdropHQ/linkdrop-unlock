class Tokens {
  constructor (actions) {
    this.actions = actions
  }

  claimTokensERC20 ({ wallet, tokenAddress, weiAmount, tokenAmount, expirationTime, linkKey, linkdropMasterAddress, linkdropSignerSignature }) {
    this.actions.dispatch({ type: '*TOKENS.CLAIM_TOKENS_ERC20', payload: { wallet, weiAmount, tokenAddress, tokenAmount, expirationTime, linkKey, linkdropMasterAddress, linkdropSignerSignature } })
  }

  claimTokensERC721 ({ wallet, nftAddress, tokenId, weiAmount, expirationTime, linkKey, linkdropMasterAddress, linkdropSignerSignature }) {
    this.actions.dispatch({ type: '*TOKENS.CLAIM_TOKENS_ERC721', payload: { wallet, weiAmount, nftAddress, tokenId, expirationTime, linkKey, linkdropMasterAddress, linkdropSignerSignature } })
  }

  checkTransactionStatus ({ transactionId, networkId }) {
    this.actions.dispatch({ type: '*TOKENS.CHECK_TRANSACTION_STATUS', payload: { transactionId, networkId } })
  }

  checkIfClaimed ({ linkKey, networkId, linkdropMasterAddress }) {
    this.actions.dispatch({ type: '*TOKENS.CHECK_IF_CLAIMED', payload: { linkKey, networkId, linkdropMasterAddress } })
  }
}

export default Tokens
