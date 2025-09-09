import type { RouteRecordRaw } from 'vue-router'
import { coreRoutes, fallbackNotFoundRoute } from './core'
import { traverseTreeValues } from '@/utils/tree'
import { mergeRouteModules } from '@/utils/merge-route-modules'

// 动态读取文件路由
const dynamicRouteFiles = import.meta.glob('./modules/**/*.ts', {
	eager: true
})

/** 动态路由 */
const dynamicRoutes: RouteRecordRaw[] = mergeRouteModules(dynamicRouteFiles)

const staticRoutes: RouteRecordRaw[] = []
const externalRoutes: RouteRecordRaw[] = []

const routes: RouteRecordRaw[] = [...coreRoutes, ...externalRoutes, fallbackNotFoundRoute]

/** 基本路由列表，这些路由不需要进入权限拦截 */
const coreRouteNames = traverseTreeValues(coreRoutes, (route) => route.name)

/** 有权限校验的路由列表，包含动态路由和静态路由 */
const accessRoutes = [...dynamicRoutes, ...staticRoutes]

export { accessRoutes, coreRouteNames, routes }
