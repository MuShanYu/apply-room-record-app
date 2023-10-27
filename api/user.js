import http from '@/config/request.config.js'

export default {

	login: (userLoginDTO) => {
		return http.post('/user/login', userLoginDTO)
	},

	register: (userRegisterDTO) => {
		return http.post('/user/register', userRegisterDTO)
	},

	updatePwd: (userUpdatePwdDTO) => {
		return http.post('/user/update/pwd', userUpdatePwdDTO)
	},

	getVerifyCode: (tel) => {
		return http.get('/user/get/verifyCode', {
			params: {
				tel: tel
			}
		})
	},

	updateInfo: (userUpdateDTO) => {
		return http.post('/user/update/userInfo', userUpdateDTO)
	},
	
	updateUserNickname: (userUpdateNicknameDTO) => {
		return http.post('/user/update/nickname', userUpdateNicknameDTO)
	},
}
