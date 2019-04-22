const ethers = require('ethers')
const express = require('express')
const app = express()
app.use(express.urlencoded())

const router = express.Router()
const PORT = process.env.PORT || 5000
app.listen(PORT, () => console.log(`Running server on port ${PORT}`))

const claimController = require('./controllers/claimController')

router.get('/', (req, res) => res.send('Hello World!'))

app.post('/linkdrops/claim', claimController.claim)
