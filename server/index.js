const express = require('express')
const app = express()
const mongodb = require('./js/mongodb')
const apiRoute = require('./js/apiRoute')
const cryptoSetup = require('./js/cryptoSetup')
require('dotenv').config()

app.use((req, res, next) => {
	if (req.url.slice(0, 4).toLowerCase() === '/api') next()
	else res.send('This site is working perfectly.')
})
app.use(
	require('cors')({
		origin: JSON.parse(process.env.allowed),
		optionsSuccessStatus: 200,
		methods: 'GET, POST, PUT, DELETE'
	})
)
app.use(
	express.urlencoded({
		extended: false
	})
)
app.use(express.json())
app.use('/api', apiRoute)

async function listen() {
	let mongoStat = await mongodb()
	if (mongoStat) {
		app.listen(process.env.port, () => console.log(`Listening on http://localhost:${process.env.port}`))
		cryptoSetup()
	} else console.log('Error in mongoDB')
}
listen()
