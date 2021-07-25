const aes = require('crypto-js/aes')
const { enc } = require('crypto-js/core')

module.exports = () => {
	global.crypt = {
		enc(txt, key) {
			if (!key) key = process.env.jsonKey
			return encodeURIComponent(aes.encrypt(txt, key).toString())
		},
		dec(encTxt, key) {
			if (!key) key = process.env.jsonKey
			return aes.decrypt(decodeURIComponent(encTxt), key).toString(enc.Utf8)
		}
	}
}
