import http from '@/config/request.config.js'

export function queryMyMessageListApi(page, size=10) {
	return http.get('/message/list', {
		params: {
			page,
			size
		}
	})
}

export function deleteMessageApi(messageId) {
	return http.delete('/message/list/' + messageId)
}

export function sendMessageApi(message) {
	return http.post('/message/list', message)
}