import http from 'config/request.config.js'

export function reservationRoomList(roomListQueryDTO) {
	let obj = Object.assign({}, roomListQueryDTO)
	if (obj.school === '任意') {
		obj.school = ''
	}
	if (obj.category === '任意') {
		obj.category = ''
	}
	if (obj.teachBuilding === '任意') {
		obj.teachBuilding = ''
	}
	return http.post('/room/queryRoom', obj)
}

export function getRoomById(id) {
	return http.get('/room/get/' + id)
}

export function reserveRoom(applyRoomDTO) {
	return http.post('/roomReservation/apply', applyRoomDTO)
}


export function queryRoomReserveToBeReviewedApi(roomReserveReviewedDTO) {
	return http.post('/roomReservation/reviewed/userRecord', roomReserveReviewedDTO)
}


export function passOrRejectReserveApi(reserveId, passed, reason) {
	return http.get('/roomReservation/approval', {
		reserveId,
		passed,
		reason
	})
}

export function myReservationApi(myApplyQueryDTO) {
	return http.post('/roomReservation/queryMyApply', myApplyQueryDTO)
}

export function cancelReserveRoomApi(roomReservationId, reason) {
	return http.get('/roomReservation/cancel', {
		roomReservationId,
		reason
	})
}

export function queryAccessRecordRoomListApi() {
	return http.get('/room/access/list')
}