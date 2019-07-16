import logger from '../utils/logger'
import Operation from '../models/Operation'
import relayerWalletService from './relayerWalletService'
const ethers = require('ethers')
const ONE_GWEI = ethers.utils.parseUnits('1', 'gwei')

class OperationService {
  findById(id) {
    return Operation.findOne({ id })
  }

  async create(id, type, data, tx = null) {
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

    logger.info(
      `Operation ${operation.type} was successfully saved to database: ${
        operation.id
      }`
    )
    return operation
  }

  async updateOnTransactionMined(id, txHash, receipt) {
    logger.debug(`Updating operation (${id}) on tx mined (${txHash})`)
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

  async retryTransaction(id, txHash) {
    logger.info(`Retrying operation (${id}) with new tx...`)
    const operation = await this.findById(id)
    const transaction = operation.transactions
      .filter(tx => tx.hash === txHash)[0]
      .toObject()

    let { nonce, gasPrice, gasLimit, value, data, to } = transaction.params
    // increase gas price
    gasPrice = ONE_GWEI.add(gasPrice)

    const params = {
      nonce,
      gasPrice,
      gasLimit,
      value: ethers.utils.parseUnits(value),
      data,
      to
    }
    logger.json(params)
    const newTx = await relayerWalletService.relayerWallet.sendTransaction(
      params
    )
    logger.info(`Submitted new tx ${newTx.hash}`)
    logger.json(newTx)

    // add new tx to database
    this.addTransaction(id, newTx)
  }

  async trackTransaction(id, txHash) {
    logger.debug(`Listening for mined tx ${txHash}...`)
    // time for loop
    const LOOP_TIME = 1000
    // maximum time to wait before retrying tx with more gas
    const WAIT_TIME_BEFORE_RETRY = 5000
    let waitTime = 0
    let retried = false

    const _tick = async () => {
      logger.debug(
        `Trying to get receipt for tx ${txHash} (${waitTime}ms passed...)`
      )
      // clear listener if operation isn't pending anymore
      const operation = await this.findById(id)
      if (operation.status !== 'pending') {
        logger.debug('Clearing listener as operation is not pending anymore')
        return null
      }

      // if tx was mined
      const receipt = await relayerWalletService.provider.getTransactionReceipt(
        txHash
      )
      if (receipt) {
        logger.debug(`Tx ${txHash} mined!`)
        logger.json(receipt)

        // save transaction status in db
        this.updateOnTransactionMined(id, txHash, receipt)
        return null
      }

      // if transaction is pending for a long time
      // and wasn't retried before
      // retry the tx again with more gas
      if (!retried && waitTime > WAIT_TIME_BEFORE_RETRY) {
        this.retryTransaction(id, txHash)
        retried = true
      }

      waitTime += LOOP_TIME
      setTimeout(_tick, LOOP_TIME)
    }

    _tick()
  }

  async addTransaction(id, tx) {
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

    logger.info(
      `Tx ${transaction.hash} was successfully saved to operation ${
        operation.id
      }`
    )
    return operation
  }
}

export default new OperationService()
