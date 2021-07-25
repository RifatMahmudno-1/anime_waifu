const fetch = require('node-fetch')

async function upload(req, res) {
	let upRes = await fetch(`https://api.imgbb.com/1/upload?key=${process.env.imgbbAPI}`, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/x-www-form-urlencoded'
		},
		body: 'image=' + encodeURIComponent(req.files.img.data.toString('base64'))
	})
		.then(r => r.json())
		.catch(() => false)

	if (!upRes || !upRes.success) return res.status(500).end()
	let obj = { main: upRes.data.url, thumb: upRes.data.thumb.url }
	db.collection('userData')
		.updateOne(
			{
				email: crypt.dec(req.body.email, process.env.mailKey),
				added: { $elemMatch: { id: parseFloat(req.body.id) } }
			},
			{ $set: { 'added.$.newImg': obj } }
		)
		.then(() => res.send(obj))
		.catch(() => res.status(500).end())
}

module.exports = upload
// let find = await db
// 	.collection('upImgs')
// 	.findOne({ _id: req.body.id })
// 	.catch(() => 'error')
// if (find == 'error') return res.status(500).end()
// let obj = { main: upRes.url, medium: upRes.medium.url, thumb: upRes.thumb.url }
// if (!find)
// 	db.collection('upImgs')
// 		.insertOne({
// 			_id: req.body.id,
// 			imgs: [obj]
// 		})
// 		.then(() => res.send(obj))
// 		.catch(() => res.status(500).end())
// else
// 	db.collection('upImgs').updateOne(
// 		{ _id: req.body.id },
// 		{
// 			$addToSet: { imgs: obj }
// 		}
// 	)
// 		.then(() => res.send(obj))
// 		.catch(() => res.status(500).end())
