import operationService from '../src/services/operationService'
import connectDB from '../src/models/connectDB'
import logger from '../src/utils/logger'

export const retryTransaction = async id => {
  await connectDB()
  console.log('\nOperation: ')

  const operation = await operationService.findById(id)
  logger.json(operation)

  const lastTxHash = getLastTxHashById(operationId)
}

retryTransaction(
  'claim-0xa048fc2513baa9a51075ba11f56bfa29aa829f9e-0x70ad7c4a9b9c938aaabcd540348971289cb73d59'
)

// claim-0xa048fc2513baa9a51075ba11f56bfa29aa829f9e-0x70ad7c4a9b9c938aaabcd540348971289cb73d59
