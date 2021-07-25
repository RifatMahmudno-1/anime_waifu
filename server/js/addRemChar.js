module.exports = {
	add(req, res) {
		if (!req.body || !req.body.email) return res.status(403).end()
		req.body.email = crypt.dec(req.body.email, process.env.mailKey)
		db.collection('userData')
			.updateOne({ email: req.body.email }, { $addToSet: { added: req.body.data } })
			.then(() => res.send({ status: 'added' }))
			.catch(() => res.status(500).end())
	},
	remove(req, res) {
		if (!req.body || !req.body.email) return res.status(403).end()
		req.body.email = crypt.dec(req.body.email, process.env.mailKey)
		db.collection('userData')
			.updateOne({ email: req.body.email }, { $pull: { added: { id: req.body.data.id } } })
			.then(() => res.send({ status: 'removed' }))
			.catch(() => res.status(500).end())
	}
}
