import { createWebHistory, createRouter } from 'vue-router'

import HomeView from '@/views/Home/index.vue'
import AboutView from '@/views/About/index.vue'

const routes = [
	{ path: '/', component: HomeView },
	{ path: '/about', component: AboutView }
]

const router = createRouter({
	history: createWebHistory(import.meta.env.BASE_URL),
	routes
})

export default router
