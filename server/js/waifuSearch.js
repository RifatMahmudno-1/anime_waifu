let months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
const fetch = require('node-fetch')
module.exports = (req, res) => {
	let type = req.body.type
	let name = req.body.name
	let email = req.body.email ? crypt.dec(req.body.email, process.env.mailKey) : undefined
	if (!type || !name || !email) res.status(403).end()
	else if (type == 'q') byName(name, email, res)
	else if (type == 'ani') byAniMan('ANIME', name, email, res)
	else if (type == 'man') byAniMan('MANGA', name, email, res)
	else res.status(403).end()
}
let byName = function (name, email, res) {
	fetch('https://graphql.anilist.co', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			'Accept': 'application/json'
		},
		body: JSON.stringify({ query: `{Character(search:"${name}"){id siteUrl name{full}image{large}dateOfBirth{day month}description(asHtml: true)}}` })
	})
		.then(r => r.json())
		.then(async r => {
			if (r.data.Character == null) res.send([])
			else {
				let added = await db
					.collection('userData')
					.findOne({ email: email })
					.then(r => r.added)
					.catch(() => false)
				if (typeof added !== 'object') return res.status(500).end()
				r = r.data.Character
				res.send({
					encData: crypt.enc(JSON.stringify([{ id: r.id, siteUrl: r.siteUrl, name: r.name.full, img: r.image.large, birth: r.dateOfBirth.day ? `${r.dateOfBirth.day} ${months[r.dateOfBirth.month - 1]}` : undefined, description: r.description, added: added.find(el => el.id == r.id) ? 'added' : 'notAdded' }]))
				})
			}
		})
		.catch(() => res.status(500).end())
}
let byAniMan = function (type, name, email, res) {
	fetch('https://graphql.anilist.co', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			'Accept': 'application/json'
		},
		body: JSON.stringify({ query: `{Media(search:"${name}" type:${type}){characters{nodes{id siteUrl name{full}image{large}dateOfBirth{day month} description(asHtml:true)}}}}` })
	})
		.then(r => r.json())
		.then(async r => {
			if (r.data.Media == null) return res.send([])
			let added = await db
				.collection('userData')
				.findOne({ email: email })
				.then(r => r.added)
				.catch(() => false)
			if (typeof added !== 'object') return res.status(500).end()
			res.send({
				encData: crypt.enc(
					JSON.stringify(
						r.data.Media.characters.nodes.map(el => {
							return { id: el.id, siteUrl: el.siteUrl, name: el.name.full, img: el.image.large, birth: el.dateOfBirth.day ? `${el.dateOfBirth.day} ${months[el.dateOfBirth.month - 1]}` : undefined, description: el.description, added: added.find(e => e.id == el.id) ? 'added' : 'notAdded' }
						})
					)
				)
			})
		})
		.catch(() => res.status(500).end())
}
