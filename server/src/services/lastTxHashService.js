import claimServiceERC20 from './claimServices/claimServiceERC20'

class LastTxHashService {
  async getLastTxHash ({ linkdropMasterAddress, linkId }) {
    const claim = await claimServiceERC20.findClaimInDB({
      linkId,
      linkdropMasterAddress
    })
    const transactions = claim.transactions
    const txHash = transactions[transactions.length - 1].hash
    return txHash
  }

  async getLastTxHashById (id) {
    const claim = await claimServiceERC20.findClaimById(id)
    const transactions = claim.transactions
    const txHash = transactions[transactions.length - 1].hash
    return txHash
  }
}

export default new LastTxHashService()
