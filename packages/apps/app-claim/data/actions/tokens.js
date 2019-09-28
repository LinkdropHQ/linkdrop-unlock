class Tokens {
  constructor (actions) {
    this.actions = actions
  }

  claimTokensERC20 ({ campaignId, wallet, tokenAddress, tokenAmount, weiAmount, expirationTime, linkKey, linkdropMasterAddress, linkdropSignerSignature, lock }) {
    this.actions.dispatch({ type: '*TOKENS.CLAIM_TOKENS_ERC20', payload: { campaignId, wallet, tokenAddress, tokenAmount, weiAmount, expirationTime, linkKey, linkdropMasterAddress, linkdropSignerSignature, lock } })
  }

  claimTokensERC721 ({ wallet, campaignId, nftAddress, tokenId, weiAmount, expirationTime, linkKey, linkdropSignerSignature }) {
    this.actions.dispatch({ type: '*TOKENS.CLAIM_TOKENS_ERC721', payload: { wallet, campaignId, nftAddress, tokenId, weiAmount, expirationTime, linkKey, linkdropSignerSignature } })
  }

  checkTransactionStatus ({ transactionId, chainId }) {
    this.actions.dispatch({ type: '*TOKENS.CHECK_TRANSACTION_STATUS', payload: { transactionId, chainId } })
  }

  checkIfClaimed ({ linkKey, chainId, linkdropMasterAddress, campaignId }) {
    this.actions.dispatch({ type: '*TOKENS.CHECK_IF_CLAIMED', payload: { linkKey, chainId, linkdropMasterAddress, campaignId } })
  }
}

export default Tokens
