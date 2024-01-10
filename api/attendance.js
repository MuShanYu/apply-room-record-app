import http from '@/config/request.config.js'

export function queryAttendanceCountDetailList(dto) {
	return http.post('/attendance/query/detail/list', dto)
}