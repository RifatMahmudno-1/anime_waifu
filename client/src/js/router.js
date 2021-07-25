import { createRouter, createWebHistory } from 'vue-router'
function cookie(name) {
	return document.cookie
		.split(';')
		.find(el => el.search(name) >= 0)
		?.split('=')[1]
}
const routes = [
	{
		path: '/',
		name: 'home',
		meta: {
			title: 'Home',
			description: 'Home page of Anime Waifu website.'
		},
		component: () => import('@/views/home.vue')
	},
	{
		path: '/login',
		name: 'login',
		meta: {
			title: 'Login',
			description: 'Login and add new waifus...'
		},
		component: () => import('@/views/logReg.vue')
	},
	{
		path: '/register',
		name: 'register',
		meta: {
			title: 'Register',
			description: 'Create new account and start adding your waifus!!!.'
		},
		component: () => import('@/views/logReg.vue')
	},
	{
		path: '/search',
		name: 'search',
		meta: {
			title: 'Search Anime',
			description: 'Search anime waifus and add to your list.'
		},
		component: () => import('@/views/search.vue')
	},
	{
		path: '/error',
		name: 'errorPage',
		meta: {
			title: 'Error || Not found',
			description: "Requested page wasn't found."
		},
		component: () => import('@/views/errorPage.vue')
	},
	{
		path: '/:pathMatch(.*)*',
		redirect: '/error'
	}
]
const router = createRouter({
	history: createWebHistory(import.meta.env.BASE_URL),
	routes
})
router.beforeEach((to, from, next) => {
	let locked = ['/', '/home', '/search']
	if (locked.includes(to.path) && cookie('token') && cookie('email')) next()
	else if (locked.includes(to.path)) next({ name: 'login' })
	else next()
})

router.beforeEach((to, from, next) => {
	document.title = to.meta.title || 'Anime Waifu'
	if (to.meta.description) document.querySelector('.meta_desc').content = to.meta.description
	else document.querySelector('.meta_desc').content = 'Add your anime waifus and customize today!!'
	next()
})

export default router
