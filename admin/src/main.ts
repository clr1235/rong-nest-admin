import { createApp } from 'vue'
import router from './router'
import pinia from './store'
import App from './App.vue'
import { ElLoading } from 'element-plus'

import '@/assets/styles/index.scss'

const app = createApp(App)

// 注册Element Plus提供的v-loading指令
app.directive('loading', ElLoading.directive)

app.use(pinia)
app.use(router)

app.mount('#app')
