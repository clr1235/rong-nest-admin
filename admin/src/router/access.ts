import type {
	AccessModeType,
	ComponentRecordType,
	GenerateMenuAndRoutesOptions,
	RouteRecordStringComponent
} from '@/types'

import Layout from '@/layouts/index.vue'
import { cloneDeep, isFunction, isString } from '@/utils'
import type { RouteRecordRaw } from 'vue-router'
import { defineComponent, h, type Component, type DefineComponent } from 'vue'
import { ElLoading } from 'element-plus'
import { mapTree } from '@/utils/tree'
import { generateMenus } from './menu'
import { getMenuList } from '@/api/menu'

const forbiddenComponent = () => import('@/views/_core/fallback/forbidden.vue')

async function generateRoutes(mode: AccessModeType, options: GenerateMenuAndRoutesOptions) {
	const { routes } = options

	let resultRoutes: RouteRecordRaw[] = routes
	switch (mode) {
		case 'backend': {
			resultRoutes = await generateRoutesByBackend(options)
			break
		}
	}

	/**
	 * 调整路由树，做以下处理：
	 * 1. 对未添加redirect的路由添加redirect
	 * 2. 将懒加载的组件名称修改为当前路由的名称（如果启用了keep-alive的话）
	 */
	resultRoutes = mapTree(resultRoutes, (route) => {
		// 重新包装component，使用与路由名称相同的name以支持keep-alive的条件缓存。
		if (route.meta?.keepAlive && isFunction(route.component) && route.name && isString(route.name)) {
			const originalComponent = route.component as () => Promise<{
				default: Component | DefineComponent
			}>
			route.component = async () => {
				const component = await originalComponent()
				if (!component.default) return component
				return defineComponent({
					name: route.name as string,
					setup(props, { attrs, slots }) {
						return () => h(component.default, { ...props, ...attrs }, slots)
					}
				})
			}
		}

		// 如果有redirect或者没有子路由，则直接返回
		if (route.redirect || !route.children || route.children.length === 0) {
			return route
		}
		const firstChild = route.children[0]

		// 如果子路由不是以/开头，则直接返回,这种情况需要计算全部父级的path才能得出正确的path，这里不做处理
		if (!firstChild?.path || !firstChild.path.startsWith('/')) {
			return route
		}

		route.redirect = firstChild.path
		return route
	})

	return resultRoutes
}

async function generateAccessible(mode: AccessModeType, options: GenerateMenuAndRoutesOptions) {
	const { router } = options

	options.routes = cloneDeep(options.routes)
	// 生成路由
	const accessibleRoutes = await generateRoutes(mode, options)

	const root = router.getRoutes().find((item) => item.path === '/')

	// 获取已有的路由名称列表
	const names = root?.children?.map((item) => item.name) ?? []

	// 动态添加到router实例内
	accessibleRoutes.forEach((route) => {
		if (root && !route.meta?.noBasicLayout) {
			// 为了兼容之前的版本用法，如果包含子路由，则将component移除，以免出现多层BasicLayout
			// 如果你的项目已经跟进了本次修改，移除了所有自定义菜单首级的BasicLayout，可以将这段if代码删除
			if (route.children && route.children.length > 0) {
				delete route.component
			}
			// 根据router name判断，如果路由已经存在，则不再添加
			if (names?.includes(route.name)) {
				// 找到已存在的路由索引并更新，不更新会造成切换用户时，一级目录未更新，homePath 在二级目录导致的404问题
				const index = root.children?.findIndex((item) => item.name === route.name)
				if (index !== undefined && index !== -1 && root.children) {
					root.children[index] = route
				}
			} else {
				root.children?.push(route)
			}
		} else {
			router.addRoute(route)
		}
	})

	if (root) {
		if (root.name) {
			router.removeRoute(root.name)
		}
		router.addRoute(root)
	}

	// 生成菜单
	const accessibleMenus = generateMenus(accessibleRoutes, options.router)

	return { accessibleMenus, accessibleRoutes }
}

/**
 * 动态生成路由 - 后端方式
 */
async function generateRoutesByBackend(options: GenerateMenuAndRoutesOptions): Promise<RouteRecordRaw[]> {
	const { fetchMenuListAsync, layoutMap = {}, pageMap = {} } = options

	try {
		const menuRoutes = await fetchMenuListAsync?.()
		if (!menuRoutes) {
			return []
		}

		const normalizePageMap: ComponentRecordType = {}

		for (const [key, value] of Object.entries(pageMap)) {
			normalizePageMap[normalizeViewPath(key)] = value
		}

		const routes = convertRoutes(menuRoutes, layoutMap, normalizePageMap)

		return routes
	} catch (error) {
		console.error(error)
		throw error
	}
}

async function generateAccess(options: any) {
	const pageMap: ComponentRecordType = import.meta.glob('../views/**/*.vue')

	const layoutMap: ComponentRecordType = { Layout: async () => ({ default: Layout }) }

	// 执行后端权限模式
	return await generateAccessible('backend', {
		...options,
		fetchMenuListAsync: async () => {
			ElLoading.service({
				lock: true,
				text: '加载中...',
				background: 'rgba(26, 15, 15, 0.7)'
			})
			return await getMenuList()
		},
		// 可以指定没有权限跳转403页面
		forbiddenComponent,
		// 如果 route.meta.menuVisibleWithForbidden = true
		layoutMap,
		pageMap
	})
}

function convertRoutes(
	routes: RouteRecordStringComponent[],
	layoutMap: ComponentRecordType,
	pageMap: ComponentRecordType
): RouteRecordRaw[] {
	return mapTree(routes, (node) => {
		const route = node as unknown as RouteRecordRaw
		const { component, name } = node

		if (!name) {
			console.error('route name is required', route)
		}

		// layout转换
		if (component && layoutMap[component]) {
			route.component = layoutMap[component]
			// 页面组件转换
		} else if (component) {
			const normalizePath = normalizeViewPath(component)
			const pageKey = normalizePath.endsWith('.vue') ? normalizePath : `${normalizePath}.vue`
			if (pageMap[pageKey]) {
				route.component = pageMap[pageKey]
			} else {
				console.error(`route component is invalid: ${pageKey}`, route)
				route.component = pageMap['/_core/fallback/not-found.vue']
			}
		}

		return route
	})
}

function normalizeViewPath(path: string): string {
	// 去除相对路径前缀
	const normalizedPath = path.replace(/^(\.\/|\.\.\/)+/, '')

	// 确保路径以 '/' 开头
	const viewPath = normalizedPath.startsWith('/') ? normalizedPath : `/${normalizedPath}`

	// 这里耦合了vben-admin的目录结构
	return viewPath.replace(/^\/views/, '')
}

export { generateAccess }
