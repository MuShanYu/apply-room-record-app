import http from '@/config/request.config.js'

export function queryMyMessageListApi(page, size = 10, messageType = 'TODO') {
	return http.get('/message/list', {
		page,
		size,
		messageType
	})
}

export function deleteMessageApi(messageId) {
	return http.delete('/message/list/' + messageId)
}

export function sendMessageApi(message) {
	return http.post('/message/list', message)
}

export function queryMyMsgDetailList(page, size = 10, senderId, receiverId, type) {
	return http.get(`/message/my/list`, {
		page,
		size,
		type,
		senderId,
		receiverId
	})
}

export function saveMessageApi(message) {
	return http.post('/message/send', message)
}


export function setMessageToReadApi(idList) {
	return http.put('/message/read', idList)
}