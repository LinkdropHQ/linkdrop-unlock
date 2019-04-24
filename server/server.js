const express = require('express')
const app = express()
app.use(express.urlencoded({ extended: false }))
app.use(express.json())
const PORT = process.env.PORT || 5000
app.listen(PORT, () => console.log(`Running server on port ${PORT}`))

const claimController = require('./controllers/claimController')

app.get('/', (req, res) => res.send('Hello World!'))

app.post('/api/v1/linkdrops/claim', claimController.claim)
