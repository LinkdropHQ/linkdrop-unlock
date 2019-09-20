import operationService from '../services/operationService'

// POST
export const cancel = async (req, res) => {
  const linkdropMasterAddress = req.params.linkdropMasterAddress
  const linkId = req.params.linkId

  const status = await operationService.cancel({
    linkdropMasterAddress,
    linkId
  })

  // return tx hash in successful response
  res.json({
    success: true,
    status: status
  })
}

export const getLastTxHashById = async (req, res) => {
  const id = req.params.id
  const txHash = await lastTxHashService.getLastTxHashById(id)

  // return tx hash in successful response
  res.json({
    success: true,
    txHash: txHash
  })
}
