const express = require('express')
const app = express()
const cors = require('cors')

app.use(express.urlencoded({ extended: false }))
app.use(express.json())
app.use(cors())

const PORT = process.env.PORT || 5000
app.listen(PORT, () => console.log(`Running server on port ${PORT}`))

const claimController = require('./controllers/claimController')

app.get('/', (req, res) => res.send('Hello from linkdrop server'))
app.post('/api/v1/linkdrops/claim', claimController.claim)
app.post('/api/v1/linkdrops/claim-erc721', claimController.claimERC721)
