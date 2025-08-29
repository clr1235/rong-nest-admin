import { createWebHistory, createRouter } from 'vue-router'
import { createRouterGuard } from './guard'
import { routes } from './routes'

const router = createRouter({
	history: createWebHistory(import.meta.env.BASE_URL),
	routes,
	scrollBehavior: (to, _from, savedPosition) => {
		if (savedPosition) {
			return savedPosition
		}
		return to.hash ? { behavior: 'smooth', el: to.hash } : { left: 0, top: 0 }
	}
})

// 创建路由守卫
createRouterGuard(router)

export default router
