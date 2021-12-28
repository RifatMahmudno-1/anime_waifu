import { createApp } from 'vue'
import router from './router'
import App from '../App.vue'
import cookieParser from './cookieParse'
import crypto from './cryptoSetup'
import changeApi from './changeApi'

createApp(App).use(router).use(cookieParser).use(changeApi).use(crypto).mount('#app')
