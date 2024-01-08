import http from '@/config/request.config.js'

export function login(userLoginDTO) {
	return http.post('/user/login', userLoginDTO)
}

export function wxLogin(code) {
	return http.post('/user/wx/login/' + code)
}

export function wxBindApi(code) {
	return http.put('/user/wx/bind/' + code)
}

export function wxUnBindApi(code) {
	return http.put('/user/wx/unBind/' + code)
}

export function register(userRegisterDTO) {
	return http.post('/user/register', userRegisterDTO)
}

export function getVerifyCode(stuNum) {
	return http.get('/user/get/verifyCode', {
		stuNum
	})
}

export function updatePwd(userUpdatePwdDTO) {
	return http.post('/user/update/pwd', userUpdatePwdDTO)
}

export function refreshTokenApi(userId, token) {
	return http.get('/user/refresh/token', {
		userId,
		token
	})
}

export function updateUserInfoApi(userUpdateDTO) {
	return http.post('/user/update/userInfo', userUpdateDTO)
}