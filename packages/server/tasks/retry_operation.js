import operationService from '../src/services/operationService'
import lastTxHashService from '../src/services/lastTxHashService'
import connectDB from '../src/models/connectDB'
import logger from '../src/utils/logger'
import { ethers } from 'ethers'

const getOperationId = () => {
  const args = process.argv.slice(2)
  if (args.length < 1) throw new Error('Please provide operation id')
  return args[0]
}

const getGasPrice = () => {
  const args = process.argv.slice(2)
  let gasPrice = args[1]
  if (args.length < 2) {
    gasPrice = '10'
  }
  return ethers.utils.parseUnits(gasPrice, 'gwei')
}

export const retryTransactionByOperationId = async (operationId, gasPrice) => {
  await connectDB()
  const operation = await operationService.findById(operationId)
  logger.json(operation)
  const lastTxHash = await lastTxHashService.getLastTxHashById(operationId)
  operationService.retryTransaction(operationId, lastTxHash, gasPrice)
}

retryTransactionByOperationId(getOperationId(), getGasPrice())
