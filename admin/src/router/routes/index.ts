import type { RouteRecordRaw } from 'vue-router'
import { coreRoutes, fallbackNotFoundRoute } from './core'
import { traverseTreeValues } from '@/utils/tree'

const staticRoutes: RouteRecordRaw[] = []
const externalRoutes: RouteRecordRaw[] = []

const routes: RouteRecordRaw[] = [...coreRoutes, ...externalRoutes, fallbackNotFoundRoute]

/** 基本路由列表，这些路由不需要进入权限拦截 */
const coreRouteNames = traverseTreeValues(coreRoutes, (route) => route.name)

/** 有权限校验的路由列表，包含动态路由和静态路由 */
const accessRoutes = [...staticRoutes]

export { accessRoutes, coreRouteNames, routes }
