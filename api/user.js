import http from '@/config/request.config.js'

export function login(userLoginDTO) {
	return http.post('/user/login', userLoginDTO)
}

export function wxLogin(code) {
	return http.post('/user/wx/login/' + code)
}

export function register(userRegisterDTO) {
	return http.post('/user/register', userRegisterDTO)
}

export function getVerifyCode(stuNum) {
	return http.get('/user/get/verifyCode', {stuNum})
}

export function updatePwd(userUpdatePwdDTO) {
	return http.post('/user/update/pwd', userUpdatePwdDTO)
}


export default {
	updateInfo: (userUpdateDTO) => {
		return http.post('/user/update/userInfo', userUpdateDTO)
	},

	updateUserNickname: (userUpdateNicknameDTO) => {
		return http.post('/user/update/nickname', userUpdateNicknameDTO)
	},
}