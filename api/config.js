import http from '@/config/request.config.js'

export default {
	querySysConfigByKeyApi(key) {
		return http.get('/config/get/by/' + key)
	},
}
