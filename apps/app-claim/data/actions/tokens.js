class Tokens {
  constructor (actions) {
    this.actions = actions
  }

  claimTokensERC20 ({ isApprove, wallet, chainId, tokenAddress, weiAmount, tokenAmount, expirationTime, linkKey, linkdropMasterAddress, linkdropSignerSignature }) {
    this.actions.dispatch({ type: '*TOKENS.CLAIM_TOKENS_ERC20', payload: { wallet, weiAmount, isApprove, tokenAddress, tokenAmount, expirationTime, linkKey, chainId, linkdropMasterAddress, linkdropSignerSignature } })
  }

  claimTokensERC721 ({ isApprove, wallet, chainId, nftAddress, tokenId, weiAmount, expirationTime, linkKey, linkdropMasterAddress, linkdropSignerSignature }) {
    this.actions.dispatch({ type: '*TOKENS.CLAIM_TOKENS_ERC721', payload: { wallet, weiAmount, isApprove, nftAddress, tokenId, expirationTime, linkKey, chainId, linkdropMasterAddress, linkdropSignerSignature } })
  }

  checkTransactionStatus ({ transactionId, chainId }) {
    this.actions.dispatch({ type: '*TOKENS.CHECK_TRANSACTION_STATUS', payload: { transactionId, chainId } })
  }

  checkIfClaimed ({ linkKey, chainId, linkdropMasterAddress }) {
    this.actions.dispatch({ type: '*TOKENS.CHECK_IF_CLAIMED', payload: { linkKey, chainId, linkdropMasterAddress } })
  }
}

export default Tokens
