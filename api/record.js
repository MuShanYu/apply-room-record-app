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

export default {
	userAccessRecordListApi: (page, size) => {
		return http.get('/record/query/list', {
			params: {
				page: page,
				size: size
			}
		})
	},
	userAccessCountApi: (page, size) => {
		return http.get('/record/query/list/count', {
			params: {
				page: page,
				size: size
			}
		})
	}
}
