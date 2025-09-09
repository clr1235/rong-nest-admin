import { user } from '@/api'
import type { UserInfo } from '@/types'
import { useAccessStore } from '@/store/access'
import { acceptHMRUpdate, defineStore } from 'pinia'

interface BasicUserInfo {
	[key: string]: any
	/**
	 * 头像
	 */
	avatar?: string
	/**
	 * 用户昵称
	 */
	realName?: string
	/**
	 * 用户角色
	 */
	roles?: string[]
	/**
	 * 用户id
	 */
	userId?: string
	/**
	 * 用户名
	 */
	username: string
}

interface AccessState {
	/**
	 * 用户信息
	 */
	userInfo: BasicUserInfo | null
	/**
	 * 用户角色
	 */
	userRoles: string[]
	token: string
}

export const useUserStore = defineStore('core-user', {
	actions: {
		setUserInfo(userInfo: BasicUserInfo | null) {
			// 设置用户信息
			this.userInfo = userInfo
			// 设置角色信息
			const roles = userInfo?.roles ?? []
			this.setUserRoles(roles)
		},
		setUserRoles(roles: string[]) {
			this.userRoles = roles
		},
		login(userInfo: BasicUserInfo) {
			const accessStore = useAccessStore()
			return new Promise((resolve, reject) => {
				user
					.login(userInfo)
					.then((res: any) => {
						accessStore.setAccessToken(res.data.token)
						this.token = res.data.token
						resolve(res)
					})
					.catch((err) => {
						reject(err)
					})
			})
		},
		// 获取用户信息
		async fetchUserInfo() {
			const userData = (await user.getUserInfo({})) as unknown as UserInfo
			this.setUserInfo(userData.data)
			return userData
		}
	},
	state: (): AccessState => {
		const accessStore = useAccessStore()
		return {
			userInfo: null,
			userRoles: [],
			token: accessStore.accessToken ?? ''
		}
	}
})

// 解决热更新问题
const hot = import.meta.hot
if (hot) {
	hot.accept(acceptHMRUpdate(useUserStore, hot))
}
