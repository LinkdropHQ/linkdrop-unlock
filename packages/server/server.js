import connectDB from './src/models/connectDB'
import logger from './src/utils/logger'
const express = require('express')
const app = express()
const cors = require('cors')
const buildRouter = require('./src/routes')

// Apply middlewares
app.use(express.urlencoded({ extended: false }))
app.use(express.json())
app.use(cors())

// connect to database
connectDB()
  .then(() => {
    // Run server
    const PORT = process.env.PORT || process.env.CUSTOM_PORT || 5000
    app.listen(PORT, () => {
      logger.info(`Server is up on port ${PORT}\n`)
    })
  })
  .catch(err => {
    logger.error(`${err}\n`)
    process.exit(1)
  })

// Define routes
app.get('/', (req, res) => res.send('👋  Hello from linkdrop server'))
app.use('/api/v1/', buildRouter('routes'))

// Error handling middleware
app.use((error, req, res, next) => {
  logger.error(error.message)
  if (error.isOperational) {
    res.status(error.statusCode)
    res.send({ success: false, error: error.message })
  } else {
    // don't send error details to the scary external world
    logger.error(error.stack)
    let errorMsg = 'Server error occured!'
    res.status(500)
    res.send({ success: false, error: errorMsg })
  }
  return null
})
