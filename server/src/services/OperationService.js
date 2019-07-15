import logger from '../utils/logger'
import Operation from '../models/Operation'

class OperationService {
  findById (id) {
    return Operation.findOne({ id })
  }
  
  async create (id, type, data, tx = null) {
    // const transaction = {
    //   hash: tx.hash,
    //   status: 'pending',
    //   params: tx
    // }
    const operation = new Operation({
      id,
      type,
      status: 'created',
      data,
      transactions: []
    })
    
    logger.debug('Saving operation to database:')
    logger.debug(JSON.stringify(operation.toObject(), null, 2))
    
    await operation.save()
    
    logger.info(`Operation ${operation.type} was successfully saved to database: ${operation.id}`)
    return operation
  }

  async addTransaction (id, tx) {
    const operation = await this.findById(id)

    const transaction = {
      hash: tx.hash,
      status: 'pending',
      params: tx
    }    
    logger.debug(`Adding transaction to operation: ${id}`)
    logger.debug(JSON.stringify(transaction, null, 2))

    operation.transactions.push(transaction)
    
    // update operation status to pending
    operation.status = 'pending'
    await operation.save()
    
    logger.info(`Tx ${transaction.hash} was successfully saved to operation ${operation.id}`)
    return operation
  }  
}

export default new OperationService()
