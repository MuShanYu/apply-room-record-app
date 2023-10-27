import http from '@/config/request.config.js'

export default {
	reservationRoomList: (roomListQueryDTO) => {
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
	},
	reserveRoom: (applyRoomDTO) => {
		return http.post('/roomReservation/apply', applyRoomDTO)
	},
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
	getRoomById: (id) => {
		return http.get('/room/get/' + id)
	},
}
