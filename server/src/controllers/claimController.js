import claimService from '../services/claimService'

export const claim = async (req, res) => {
  // claim transaction
  const txHash = await claimService.claim(req.body)

  // return tx hash in successful response
  res.json({
    success: true,
    txHash: txHash
  })
}
