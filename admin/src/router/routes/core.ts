import { preferences } from '@/config/constants'
import type { RouteRecordRaw } from 'vue-router'

const Layout = () => import('@/layouts/index.vue')

/** 全局404页面 */
const fallbackNotFoundRoute: RouteRecordRaw = {
	component: () => import('@/views/_core/fallback/not-found.vue'),
	meta: {
		hideInBreadcrumb: true,
		hideInMenu: true,
		hideInTab: true,
		title: '404'
	},
	name: 'FallbackNotFound',
	path: '/:path(.*)*'
}

// 基本路由
const coreRoutes: RouteRecordRaw[] = [
	{
		component: Layout,
		meta: {
			hideInBreadcrumb: true,
			title: 'Root'
		},
		name: 'Root',
		path: '/',
		redirect: preferences.app.defaultHomePath,
		children: []
	},
	{
		name: 'Login',
		path: '/login',
		component: () => import('@/views/login/index.vue'),
		meta: {
			hideInBreadcrumb: true,
			hideInMenu: true,
			hideInTab: true,
			title: '登录'
		}
	}
]

export { coreRoutes, fallbackNotFoundRoute }
