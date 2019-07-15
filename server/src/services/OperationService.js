import logger from '../utils/logger'
import Operation from '../models/Operation'
import relayerWalletService from './relayerWalletService'

class OperationService {
  findById (id) {
    return Operation.findOne({ id })
  }
  
  async create (id, type, data, tx = null) {
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

  async updateOnTransactionMined (id, txHash, receipt) {
    logger.debug(`Updating operation (${id}) on tx mined (${txHash}`)
    const operation = await this.findById(id)
    const status = receipt.status === 1 ? 'completed' : 'error'
    operation.status = status
    operation.transactions.map(tx => {
      logger.json(tx)
      if (tx.hash === txHash) {
        tx.status = status
      } else {
        tx.status = 'dropped'
      }
    })
    
    await operation.save()
    logger.debug(`Operation ${id} updated on tx mined`)
    logger.json(operation)
  }
  
  async trackTransaction (id, txHash) {
    logger.debug(`Listening for mined tx ${txHash}...`)
    
    let waitTime = 0
    const loopTime = 10000
    
    const _tick = async () => {
      logger.debug(`Trying to get receipt for tx ${txHash} (${waitTime}ms passed...)`)
      // clear listener if operation isn't pending anymore
      const operation = await this.findById(id)
      if (operation.status !== 'pending') {
        logger.debug('Clearing listener as operation is not pending anymore')
        return null
      }
      
      const receipt = await relayerWalletService.provider.getTransactionReceipt(txHash)
      // tx was mined
      if (receipt) {
        logger.debug(`Tx ${txHash} mined!`)
        logger.json(receipt)

        // #todo: save transaction status in db
        this.updateOnTransactionMined(id, txHash, receipt)
        
        return null
      }
      
      waitTime += loopTime
      setTimeout(_tick, loopTime)
    }
    
    _tick()
  }
  
  async addTransaction (id, tx) {
    const operation = await this.findById(id)

    const transaction = {
      hash: tx.hash,
      status: 'pending',
      params: tx
    }
    logger.debug(`Adding transaction to operation: ${id}`)
    logger.json(transaction)
    
    operation.transactions.push(transaction)
    
    // update operation status to pending
    operation.status = 'pending'
    await operation.save()

    // add listener for mined transactions
    this.trackTransaction(id, tx.hash)
    
    logger.info(`Tx ${transaction.hash} was successfully saved to operation ${operation.id}`)
    return operation
  }
}

export default new OperationService()
