import { terminal as term } from 'terminal-kit'
import configs from '../configs'

const mongoose = require('mongoose')
const express = require('express')
const app = express()
const cors = require('cors')
const claimController = require('./controllers/claimController')

const config = configs.get('server')

const { mongoURI } = config

// Apply middlewares
app.use(express.urlencoded({ extended: false }))
app.use(express.json())
app.use(cors())

// Set up default mongoose connection
mongoose
  .connect(
    mongoURI || 'mongodb://localhost:27017/linkdrop_db',
    { useNewUrlParser: true, useCreateIndex: true }
  )
  .then(() => {
    // Run server
    const PORT = process.env.PORT || 5000
    app.listen(PORT, () => {
      term.green.bold(`Server is up on port ${PORT}\n`)
    })
  })
  .catch(err => {
    term.red.bold(`${err}\n`)
    process.exit(1)
  })

// Define routes
app.get('/', (req, res) => res.send('👋  Hello from linkdrop server'))
app.post('/api/v1/linkdrops/claim', claimController.claim)
app.post('/api/v1/linkdrops/claim-erc721', claimController.claimERC721)
