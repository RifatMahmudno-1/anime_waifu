export default function (cookies) {
	let arr = Object.keys(cookies)
	if (arr.includes('email') && arr.includes('token')) {
	} else return false
}
