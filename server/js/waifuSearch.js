let months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
const fetch = require('node-fetch')
module.exports = (req, res) => {
	let type = req.body.type
	let name = req.body.name
	let page = req.body.page ? parseInt(req.body.page) : 1
	let email = req.body.email ? crypt.dec(req.body.email, process.env.mailKey) : undefined
	if (!type || !name || !email) res.status(403).end()
	else if (type == 'q') byName(name, email, res, page)
	else if (type == 'ani') byAniMan('ANIME', name, email, res, page)
	else if (type == 'man') byAniMan('MANGA', name, email, res, page)
	else res.status(403).end()
}
let byName = function (name, email, res, page) {
	fetch('https://graphql.anilist.co', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			'Accept': 'application/json'
		},
		body: JSON.stringify({ query: `{Page(perPage:10,page:${page}){pageInfo{currentPage,hasNextPage}characters(search:"${name}",sort:SEARCH_MATCH){id,name{full}image{large}dateOfBirth{day,month}siteUrl,description(asHtml:true)}}}` })
	})
		.then(r => r.json())
		.then(async r => {
			r = r.data.Page
			if (r.characters.length == 0) res.send([])
			else {
				let added = await db
					.collection('userData')
					.findOne({ email: email })
					.then(r => r.added)
					.catch(() => false)
				if (typeof added !== 'object') return res.status(500).end()
				res.send({
					encData: crypt.enc(
						JSON.stringify({
							page: r.pageInfo,
							data: r.characters.map(el => {
								return { id: el.id, siteUrl: el.siteUrl, name: el.name.full, img: el.image.large, birth: el.dateOfBirth.day ? `${el.dateOfBirth.day} ${months[el.dateOfBirth.month - 1]}` : undefined, description: el.description, added: added.find(e => e.id == el.id) ? 'added' : 'notAdded' }
							})
						})
					)
				})
			}
		})
		.catch(() => res.status(500).end())
}
let byAniMan = function (type, name, email, res, page) {
	fetch('https://graphql.anilist.co', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			'Accept': 'application/json'
		},
		body: JSON.stringify({ query: `{Media(search:"${name}",type:${type}){characters(page:${page},perPage:25,sort:[ROLE,RELEVANCE,ID]){pageInfo{currentPage,hasNextPage}nodes{id,siteUrl,name{full},image{large},dateOfBirth{day,month},description(asHtml:true)}}}}` })
	})
		.then(r => r.json())
		.then(async r => {
			if (r.data.Media == null) return res.send([])
			r = r.data.Media.characters
			let added = await db
				.collection('userData')
				.findOne({ email: email })
				.then(r => r.added)
				.catch(() => false)
			if (typeof added !== 'object') return res.status(500).end()
			res.send({
				encData: crypt.enc(
					JSON.stringify({
						page: r.pageInfo,
						data: r.nodes.map(el => {
							return { id: el.id, siteUrl: el.siteUrl, name: el.name.full, img: el.image.large, birth: el.dateOfBirth.day ? `${el.dateOfBirth.day} ${months[el.dateOfBirth.month - 1]}` : undefined, description: el.description, added: added.find(e => e.id == el.id) ? 'added' : 'notAdded' }
						})
					})
				)
			})
		})
		.catch(() => res.status(500).end())
}
