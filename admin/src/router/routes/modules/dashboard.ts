import { preferences } from '@/config/constants'
import type { RouteRecordRaw } from 'vue-router'

const Layout = () => import('@/layouts/index.vue')

const routes: RouteRecordRaw[] = [
	{
		component: Layout,
		meta: {
			hideInBreadcrumb: true,
			title: 'Root'
		},
		name: 'Root',
		path: '/',
		redirect: preferences.app.defaultHomePath,
		children: [
			{
				path: '/analytics',
				component: () => import('@/views/dashboard/analytics/index.vue'),
				name: 'Analytics',
				meta: { title: '首页', icon: 'dashboard', affix: true }
			}
		]
	}
]

export default routes
