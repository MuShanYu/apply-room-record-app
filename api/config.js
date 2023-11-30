import http from '@/config/request.config.js'

export function querySysConfigByKeyApi(key) {
	return http.get('/config/get/by/' + key)
}