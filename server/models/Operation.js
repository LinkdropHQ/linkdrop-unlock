import mongoose from 'mongoose'
import TransactionSchema from './Transaction'

const OperationSchema = new mongoose.Schema({
  type: {
    type: String,
    required: true,
    enum: ['claim', 'metatx']
  },
  transactions: [TransactionSchema],
  // data for the operation:
  // (different for each operation type)
  data: {
    type: Object
  },
  // should be equal to status of the latest transaction
  status: {
    type: String,
    required: true,
    default: 'created',
    enum: ['created', 'pending', 'completed', 'error']
  }
})

const Operation = mongoose.model('Operation', OperationSchema)
export default Operation
