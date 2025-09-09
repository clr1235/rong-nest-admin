import request from '@/utils/request'

// 新增菜单
export function getMenuList(data?: any) {
	return request({
		url: '/api/user/menu',
		method: 'post',
		data: data
	})
}
