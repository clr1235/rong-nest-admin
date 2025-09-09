import request from '@/utils/request'

// 获取用户信息
export function getUserInfo(data?: any) {
	return request({
		url: '/api/user/info',
		method: 'post',
		data
	})
}

export function login(data: any) {
	return request({
		url: '/api/user/login',
		method: 'post',
		data
	})
}
