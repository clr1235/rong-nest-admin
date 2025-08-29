import request from '@/utils/request'

// 获取用户信息
export function getUserInfo(data: any) {
	return request({
		url: '/user/info',
		method: 'get',
		params: data
	})
}
