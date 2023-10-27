import http from '@/config/request.config.js'

export default {
	addAccessRecordApi: (addRecordDTO) => {
		return http.post('/record/add/in/or/out', addRecordDTO)
	},
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
