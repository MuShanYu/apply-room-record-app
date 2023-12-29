import http from '@/config/request.config.js'

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


export function passOrRejectReserveApi(reserveId, passed, rejectReason) {
	return http.get('/roomReservation/approval', {
		reserveId,
		passed,
		rejectReason
	})
}

export default {
	cancelReserveRoom: (roomReservationId) => {
		return http.get('/roomReservation/cancel', {
			params: {
				roomReservationId: roomReservationId
			}
		})
	},
	myReservation: (myApplyQueryDTO) => {
		let obj = Object.assign({}, myApplyQueryDTO)
		if (obj.school === '任意') {
			obj.school = ''
		}
		if (obj.category === '任意') {
			obj.category = ''
		}
		if (obj.teachBuilding === '任意') {
			obj.teachBuilding = ''
		}
		return http.post('/roomReservation/queryMyApply', obj)
	},
}