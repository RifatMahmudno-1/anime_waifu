import { createApp } from 'vue'
import router from './router'
import App from '../App.vue'
import cookieParser from './cookieParse'
import crypto from './cryptoSetup'

function API(app) {
	app.config.globalProperties.$API = import.meta.env.VITE_API
}

createApp(App).use(router).use(cookieParser).use(crypto).use(API).mount('#app')
