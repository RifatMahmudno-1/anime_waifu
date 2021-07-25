const router = require('express').Router()
const waifuSearch = require('./waifuSearch')
const logReg = require('./logReg')
const addRemChar = require('./addRemChar')
const getList = require('./getList')
const imgUp = require('./imgUp')

router.get((req, res) => res.send("This this the anime waifu webite's api"))

router.use(require('express-fileupload')())

router.use((req, res, next) => {
	if (req.path == '/log_reg') next()
	else if (req.body && req.body.token && req.body.email && crypt.dec(req.body.token, process.env.toKey) == crypt.dec(req.body.email, process.env.mailKey)) next()
	else res.status(401).end()
})
router.use((req, res, next) => {
	if (req.body && req.body.encData) req.body = JSON.parse(crypt.dec(req.body.encData))
	next()
})
router.route('/editList').put(addRemChar.add).delete(addRemChar.remove)

router.post('/getlist', getList)

router.post('/search', waifuSearch)

router.route('/log_reg').put(logReg.register).post(logReg.login)

router.put('/imgUp', imgUp)

module.exports = router
