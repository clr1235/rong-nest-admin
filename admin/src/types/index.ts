import type { Component } from 'vue'
import type { Router, RouteRecordRaw } from 'vue-router'

interface BasicUserInfo {
	[key: string]: any
	/**
	 * 头像
	 */
	avatar: string
	/**
	 * 用户昵称
	 */
	realName: string
	/**
	 * 用户角色
	 */
	roles?: string[]
	/**
	 * 用户id
	 */
	userId: string
	/**
	 * 用户名
	 */
	username: string
}

/** 用户信息 */
interface UserInfo extends BasicUserInfo {
	/**
	 * 用户描述
	 */
	desc: string
	/**
	 * 首页地址
	 */
	homePath: string

	/**
	 * accessToken
	 */
	token: string
}

type ComponentRecordType = Record<string, () => Promise<Component>>

/**
 * 权限模式
 * backend 后端权限模式
 * frontend 前端权限模式
 * mixed 混合权限模式
 */
type AccessModeType = 'backend' | 'frontend' | 'mixed'

// 定义递归类型以将 RouteRecordRaw 的 component 属性更改为 string
type RouteRecordStringComponent<T = string> = Omit<RouteRecordRaw, 'children' | 'component'> & {
	children?: RouteRecordStringComponent<T>[]
	component: T
}

interface GenerateMenuAndRoutesOptions {
	fetchMenuListAsync?: () => Promise<RouteRecordStringComponent[]>
	forbiddenComponent?: RouteRecordRaw['component']
	layoutMap?: ComponentRecordType
	pageMap?: ComponentRecordType
	roles?: string[]
	router: Router
	routes: RouteRecordRaw[]
}

/**
 * 扩展路由原始对象
 */
type ExRouteRecordRaw = RouteRecordRaw & {
	parent?: string
	parents?: string[]
	path?: any
}

interface MenuRecordBadgeRaw {
	/**
	 * 徽标
	 */
	badge?: string
	/**
	 * 徽标类型
	 */
	badgeType?: 'dot' | 'normal'
	/**
	 * 徽标颜色
	 */
	badgeVariants?: 'destructive' | 'primary' | string
}

/**
 * 菜单原始对象
 */
interface MenuRecordRaw extends MenuRecordBadgeRaw {
	/**
	 * 激活时的图标名
	 */
	activeIcon?: string
	/**
	 * 子菜单
	 */
	children?: MenuRecordRaw[]
	/**
	 * 是否禁用菜单
	 * @default false
	 */
	disabled?: boolean
	/**
	 * 图标名
	 */
	icon?: Component | string
	/**
	 * 菜单名
	 */
	name: string
	/**
	 * 排序号
	 */
	order?: number
	/**
	 * 父级路径
	 */
	parent?: string
	/**
	 * 所有父级路径
	 */
	parents?: string[]
	/**
	 * 菜单路径，唯一，可当作key
	 */
	path: string
	/**
	 * 是否显示菜单
	 * @default true
	 */
	show?: boolean
}

export type {
	UserInfo,
	ComponentRecordType,
	GenerateMenuAndRoutesOptions,
	AccessModeType,
	MenuRecordRaw,
	MenuRecordBadgeRaw,
	ExRouteRecordRaw,
	RouteRecordStringComponent
}
