import http from '@/config/request.config.js'

export default {
	getRoomClassifyInfo() {
		return http.get('/user/get/classify/room')
	},
	getInstituteClassifyInfo() {
		return http.get('/admin/get/classify/institute')
	},
}
