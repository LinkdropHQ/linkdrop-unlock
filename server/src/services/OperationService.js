import logger from '../utils/logger'
import Operation from '../models/Operation'
// import TransactionService from '../models/Transaction'

class OperationService {
  findById (id) {
    return Operation.findOne({ id })
  }
  
  async create (id, type, data, tx) {
    const transaction = {
      hash: tx.hash,
      status: 'pending',
      params: tx
    }
    const operation = new Operation({
      id,
      type,
      status: 'pending',
      data,
      transactions: [ transaction ]
    })
    
    logger.debug('Saving operation to database:')
    logger.debug(JSON.stringify(operation.toObject(), null, 2))
    
    await operation.save()
    
    logger.info(`Operation ${operation.type} was successfully saved to database: ${operation.id}`)
    return operation
  }
}

export default new OperationService()
