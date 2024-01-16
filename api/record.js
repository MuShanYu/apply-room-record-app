import http from '@/config/request.config.js'

export function queryCanApplyAccessRecordListApi(query) {
	return http.get('/record/query/list/can-apply', {
		page: query.page,
		size: query.size,
		roomName: query.roomName
	})
}

export function findByIdApi(id) {
	return http.get('/record/get/' + id)
}