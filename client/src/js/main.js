import { createApp } from 'vue'
import router from './router'
import App from '../App.vue'
import cookieParser from './cookieParse'
import crypto from './cryptoSetup'
createApp(App).use(router).use(cookieParser).use(crypto).mount('#app')
