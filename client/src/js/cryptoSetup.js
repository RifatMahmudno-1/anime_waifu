import aes from 'crypto-js/aes'
import { enc } from 'crypto-js/core'
export default function (app) {
	app.config.globalProperties.$crypt = {
		enc(txt, key) {
			if (!key) key = import.meta.env.VITE_jsonKey
			return encodeURIComponent(aes.encrypt(txt, key).toString())
		},
		dec(encTxt, key) {
			if (!key) key = import.meta.env.VITE_jsonKey
			return aes.decrypt(decodeURIComponent(encTxt), key).toString(enc.Utf8)
		}
	}
}
