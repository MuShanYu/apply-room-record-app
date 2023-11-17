import http from '@/config/request.config.js'

export function saveApplicationApi(application) {
	http.post('/application/save', application)
}

export function queryApplicationListApi(applicationListQuery) {
	http.post('/application/query/list', applicationListQuery)
}

export function queryMyApplicationListApi(applicationListQuery) {
	http.post('/application/query/list/my', applicationListQuery)
}

export function updateApplicationStateApi(applicationId, isPass) {
	http.post('/application', {
		params: {
			applicationId,
			isPass
		}
	})
}

