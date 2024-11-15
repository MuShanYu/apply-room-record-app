import http from '@/config/request.config.js'

export function queryNoticeListApi(page, size) {
	return http.get('/notice/query/user/list', {page, size})
}
