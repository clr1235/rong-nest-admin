import type { UserInfo } from '@/types'
import { defineStore } from 'pinia'

import { user } from '@/api'
import { useAccessStore } from './access'
import { useUserStore } from './user'
import { useRouter } from 'vue-router'

export const useAuthStore = defineStore('auth', () => {
	const accessStore = useAccessStore()
	const userStore = useUserStore()
	const router = useRouter()

	async function fetchUserInfo() {
		let userInfo: null | UserInfo = null
		userInfo = (await user.getUserInfo({})) as unknown as UserInfo
		userStore.setUserInfo(userInfo)
		return userInfo
	}

	return {
		fetchUserInfo
	}
})
