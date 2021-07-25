module.exports = (req, res) => {
	if (!req.body || !req.body.email) return res.status(403).end()
	db.collection('userData')
		.findOne({ email: crypt.dec(req.body.email, process.env.mailKey) })
		.then(r => {
			res.send({ data: crypt.enc(JSON.stringify(r.added)) })
		})
		.catch(() => res.status(500).end())
}
