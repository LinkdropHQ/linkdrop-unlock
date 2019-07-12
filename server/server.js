import { terminal as term } from 'terminal-kit'
import connectDB from './models/connectDB'

const asyncHandler = require('express-async-handler')
const express = require('express')
const app = express()
const cors = require('cors')
const claimController = require('./controllers/claimController')
const lastTxHashController = require('./controllers/lastTxHashController')


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
        term.green.bold(`Server is up on port ${PORT}\n`)
      })
    }).catch(err => {
      term.red.bold(`${err}\n`)
      process.exit(1)
    })

// Define routes
app.get('/', (req, res) => res.send('👋  Hello from linkdrop server'))
app.post('/api/v1/linkdrops/claim', asyncHandler(claimController.claim))
app.post(
  '/api/v1/linkdrops/claim-erc721',
  asyncHandler(claimController.claimERC721)
)

app.get(
  '/api/v1/linkdrops/getLastTxHash/:paramsHash',
  asyncHandler(lastTxHashController.getLastTxHash)
)

// Error handling
app.use((err, req, res, next) => {
  console.error(err)
  res.status(err.status || 500)
  let error = err.message || 'Server error!'
  res.send({ success: false, error })
  return null
})
