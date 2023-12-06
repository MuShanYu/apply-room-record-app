import http from '@/config/request.config.js'

export function getRoomClassifyInfo() {
	return http.get('/user/get/classify/room')
}

export function getInstituteClassifyInfo() {
	return http.get('/admin/get/classify/institute')
}