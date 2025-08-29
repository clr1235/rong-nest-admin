import type { Router } from 'vue-router'
import { accessRoutes, coreRouteNames } from './routes'
import { useAccessStore } from '@/store/access'
import { useUserStore } from '@/store/user'
import { useAuthStore } from '@/store/auth'
import { generateAccess } from './access'
import { loginPath, preferences } from '@/config/constants'

import NProgress from 'nprogress'
import 'nprogress/nprogress.css'

NProgress.configure({ showSpinner: false })

// 通用路由守卫配置
function setupCommonGuard(router: Router) {
	// 记录已经加载的页面
	const loadedPaths = new Set<string>()

	router.beforeEach((to) => {
		to.meta.loaded = loadedPaths.has(to.path)
		if (!to.meta.loaded && preferences.transition.progress) {
			NProgress.start()
		}
		return true
	})

	router.afterEach((to) => {
		// 记录页面是否加载,如果已经加载，后续的页面切换动画等效果不在重复执行
		loadedPaths.add(to.path)
		// 关闭页面加载进度条
		if (preferences.transition.progress) {
			NProgress.done()
		}
	})
}

// 权限访问路由配置
function setupAccessGuard(router: Router) {
	router.beforeEach(async (to, from) => {
		const accessStore = useAccessStore()
		const userStore = useUserStore()
		const authStore = useAuthStore()

		// 基本路由不需要进行权限拦截
		if (coreRouteNames.includes(to.name as string)) {
			if (to.path === loginPath && accessStore.accessToken) {
				return decodeURIComponent(
					(to.query?.redirect as string) || userStore.userInfo?.homePath || preferences.app.defaultHomePath
				)
			}
			return true
		}

		// accessToken 检查
		if (!accessStore.accessToken) {
			// 明确声明忽略权限访问权限，则可以访问
			if (to.meta.ignoreAccess) {
				return true
			}
			// 没有访问权限，则跳转登录页面
			if (to.fullPath !== loginPath) {
				return {
					path: loginPath,
					// 如不需要，直接删除 query
					query: to.fullPath === preferences.app.defaultHomePath ? {} : { redirect: encodeURIComponent(to.fullPath) },
					// 携带当前跳转的页面，登录后重新跳转该页面
					replace: true
				}
			}
			return to
		}

		// 是否已经生成过动态路由
		if (accessStore.isAccessChecked) {
			return true
		}

		// 生成路由表
		// 当前登录用户拥有的角色标识列表
		console.log('userInfo', userStore.userInfo)
		const userInfo = userStore.userInfo || (await authStore.fetchUserInfo())
		const userRoles = userInfo.roles ?? []

		// 生成菜单和路由
		const { accessibleMenus, accessibleRoutes } = await generateAccess({
			roles: userRoles,
			router,
			// 则会在菜单中显示，但是访问会被重定向到403
			routes: accessRoutes
		})
		// 保存菜单信息和路由信息
		accessStore.setAccessMenus(accessibleMenus)
		accessStore.setAccessRoutes(accessibleRoutes)
		accessStore.setIsAccessChecked(true)
		const redirectPath = (from.query.redirect ??
			(to.path === preferences.app.defaultHomePath
				? userInfo.homePath || preferences.app.defaultHomePath
				: to.fullPath)) as string

		return {
			...router.resolve(decodeURIComponent(redirectPath)),
			replace: true
		}
	})
}

function createRouterGuard(router: Router) {
	/** 通用 */
	setupCommonGuard(router)
	/** 权限访问 */
	setupAccessGuard(router)
}

export { createRouterGuard }
