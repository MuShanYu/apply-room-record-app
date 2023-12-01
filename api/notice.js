import http from '@/config/request.config.js'

export function queryNoticeListApi(noticeQueryDTO) {
	return http.post('/notice/query/list', noticeQueryDTO)
}
