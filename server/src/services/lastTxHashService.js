import claimService from './claimService'

class LastTxHashService {
  async getLastTxHash({ linkdropMasterAddress, linkId }) {
    const claim = await claimService.findClaimInDB({
      linkId,
      linkdropMasterAddress
    })
    const transactions = claim.transactions
    const txHash = transactions[transactions.length - 1].hash
    return txHash
  }
}

export default new LastTxHashService()
