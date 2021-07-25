const { compareSync, hashSync } = require('bcrypt')

module.exports = {
	login(req, res) {
		if (!req.body || !req.body.pass || !req.body.email) res.status(403).end()
		else {
			db.collection('users')
				.findOne({
					email: req.body.email
				})
				.then(r => {
					if (r && compareSync(req.body.pass, r.pass))
						res.send({
							status: 'logged',
							cookie: {
								email: crypt.enc(r.email, process.env.mailKey),
								token: crypt.enc(r.email, process.env.toKey)
							}
						})
					else if (r) res.send({ status: 'wrong_pass' })
					else res.send({ status: 'no_account' })
				})
				.catch(() => res.status(500).end())
		}
	},
	async register(req, res) {
		if (!req.body || !req.body.name || !req.body.pass || !req.body.email) res.status(403).end()
		else {
			let duplicate = await db.collection('users').findOne({ email: req.body.email })
			let userData = await db
				.collection('userData')
				.insertOne({ email: req.body.email, added: [] })
				.then(() => true)
				.catch(() => false)
			if (!userData) res.status(500).end()
			if (duplicate) return res.send({ status: 'duplicate' })
			db.collection('users')
				.insertOne({
					name: req.body.name,
					email: req.body.email,
					pass: hashSync(req.body.pass, 10)
				})
				.then(() => res.send({ status: 'registered' }))
				.catch(() => res.status(500).end())
		}
	}
}
