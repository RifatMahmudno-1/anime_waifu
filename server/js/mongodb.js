const mongoDB = require('mongodb')
module.exports = async () => {
	return await mongoDB.MongoClient.connect(process.env.mongoUrl, {
		useUnifiedTopology: true,
		useNewUrlParser: true
	})
		.then(r => {
			global.db = r.db(process.env.mongoName)
			console.log('Connected to DB')
			return true
		})
		.catch(() => false)
}
