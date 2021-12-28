function nowDate() {
	return new Date(
		new Date().toLocaleString('en-US', {
			timeZone: 'Asia/Dhaka'
		})
	).getDate()
}

export default function (app) {
	app.config.globalProperties.$api = () => {
		if (!import.meta.env.VITE_APIurl) return console.log('No allow list added.')
		let apis = JSON.parse(import.meta.env.VITE_APIurl)
		if (apis.length == 1 || import.meta.env.dev) return apis[0]
		// if (apis.length > 2) return console.log('Only 2 apis allowed.')
		let day = new Date(nowDate())
		if (day > 15) {
			return apis[0]
		} else {
			return apis[1]
		}
	}
}
