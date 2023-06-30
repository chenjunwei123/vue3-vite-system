import { createApp } from 'vue'
import App from './App.vue'
import router from './router/index'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import axios from './static/js/axios'
import './static/css/global.css'
import msg from './static/js/message'
import './assets/fonts/iconfont.css'

// import './assets/fonts/iconfont'
const app = createApp(App)
app.config.globalProperties.$http = axios
app.config.globalProperties.$msg = msg
app.use(router)
app.use(ElementPlus)
app.mount('#app')
