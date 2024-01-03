import http from '@/config/request.config.js'

export function saveApplicationApi(application) {
	return http.post('/application/save', application)
}

export function queryApplicationListApi(applicationListQuery) {
	return http.post('/application/query/list', applicationListQuery)
}

export function queryMyApplicationListApi(applicationListQuery) {
	return http.post('/application/query/list/my', applicationListQuery)
}

export function updateApplicationStateApi(applicationId, isPass, remark) {
	return http.put('/application', {applicationId, isPass, remark}, {
		header: {
			'Content-Type': 'application/x-www-form-urlencoded'
		}
	})
}