const mongoose = require('mongoose')
const express = require('express')
const app = express()
const cors = require('cors')
const claimController = require('./controllers/claimController')
const path = require('path')
const configPath = path.resolve(__dirname, '../config/server.config.json')
const config = require(configPath)
const { mongoURI } = config

// Apply middlewares
app.use(express.urlencoded({ extended: false }))
app.use(express.json())
app.use(cors())

// Set up default mongoose connection
mongoose.connect(
  mongoURI || 'mongodb://localhost:27017/linkdrop_db',
  { useNewUrlParser: true, useCreateIndex: true }
)

// Bind connection to error event (to get notification of connection errors)
mongoose.connection.on(
  'error',
  console.error.bind(console, '📛  MongoDB connection error:')
)

// Run server
const PORT = process.env.PORT || 5000
app.listen(PORT, () => console.log(`Running server on port ${PORT}`))

// Define routes
app.get('/', (req, res) => res.send('👋  Hello from linkdrop server'))
app.post('/api/v1/linkdrops/claim', claimController.claim)
app.post('/api/v1/linkdrops/claim-erc721', claimController.claimERC721)
