import mongoose from 'mongoose'

const OperationSchema = new mongoose.Schema({
  type: {
    type: String,
    required: true,
    enum: ['claim', 'metatx']
  },
  data: {
    type: Object
  },
  status: {
    type: String,
    required: true,
    default: 'created',
    enum: ['created', 'pending', 'completed', 'error']
  }
})

const Operation = mongoose.model('Operation', OperationSchema)

export default Operation
