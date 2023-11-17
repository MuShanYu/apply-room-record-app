import http from '@/config/request.config.js'

export function queryNoticeListApi(noticeQueryDTO) {
	http.post('/notice/query/list', noticeQueryDTO)
}
