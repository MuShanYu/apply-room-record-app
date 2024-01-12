/**
 * 通用uni-app网络请求
 * 基于 Promise 对象实现更简单的 request 使用方式，支持请求和响应拦截
 */
import indexConfig from '@/config/index.config.js'
import store from '@/store/index.js'
export default {
	config: {
		baseUrl: indexConfig.baseUrl,
		header: {
			'Content-Type': 'application/json;charset=UTF-8',
			'Content-Type': 'application/x-www-form-urlencoded'
		},
		data: {},
		method: "GET",
		dataType: "json",
		/* 如设为json，会对返回的数据做一次 JSON.parse */
		responseType: "text",
		success() {},
		fail() {},
		complete() {}
	},
	interceptor: {
		request: null,
		response: null
	},
	request(options) {
		if (!options) {
			options = {}
		}
		options.baseUrl = options.baseUrl || this.config.baseUrl
		options.dataType = options.dataType || this.config.dataType
		options.url = options.baseUrl + options.url
		options.data = options.data || {}
		options.method = options.method || this.config.method
		// token处理
		if (uni.getStorageSync('token')) {
			// 可以在此通过vm引用vuex中的变量，具体值在vm.$store.state中
			let _token = {
				'token': uni.getStorageSync('token') || 'undefined'
			}
			options.header = Object.assign({}, options.header, _token)
		}
		return new Promise((resolve, reject) => {
			let _config = null

			options.complete = (response) => {

				let statusCode = response.statusCode
				response.config = _config
				if (this.interceptor.response) {
					let newResponse = this.interceptor.response(response)
					if (newResponse) {
						response = newResponse
					}
				}
				// 统一的响应日志记录
				// _reslog(response)
				// 返回结果
				if (statusCode === 200) { //成功
					// 处理响应结果
					if (response.data) {
						let serviceCode = response.data.code
						if (serviceCode !== 200) {
							handleServiceError(serviceCode, response.data.message)
							reject(response.data)
						} else {
							resolve(response.data.queryData);
						}
					}
				} else {
					reject(response)
				}
			}

			_config = Object.assign({}, this.config, options)
			_config.requestId = new Date().getTime()

			if (this.interceptor.request) {
				this.interceptor.request(_config)
			}

			// 统一的请求日志记录
			_reqlog(_config)

			uni.request(_config);
		});
	},
	get(url, data, options) {
		if (!options) {
			options = {}
		}
		options.url = url
		options.data = data
		options.method = 'GET'
		options.header = {
			'Content-Type': 'application/x-www-form-urlencoded'
		}
		return this.request(options)
	},
	post(url, data, options) {
		if (!options) {
			options = {}
		}
		options.url = url
		options.data = data
		options.method = 'POST'
		options.header = {
			'Content-Type': 'application/json;charset=UTF-8',
		}
		return this.request(options)
	},
	put(url, data, options) {
		if (!options) {
			options = {}
		}
		options.url = url
		options.data = data
		options.method = 'PUT'
		if (!options.header) {
			options.header = {
				'Content-Type': 'application/json;charset=UTF-8',
			}
		}
		return this.request(options)
	},
	delete(url, data, options) {
		if (!options) {
			options = {}
		}
		options.url = url
		options.data = data
		options.method = 'DELETE'
		return this.request(options)
	}
}



/**
 * 请求接口日志记录
 */
function _reqlog(req) {
	if (process.env.NODE_ENV === 'development') {
		console.log("【" + req.requestId + "】 地址：" + req.url)
		if (req.data) {
			console.log("【" + req.requestId + "】 请求参数：" + JSON.stringify(req.data))
		}
	}
	//TODO 调接口异步写入日志数据库
}

/**
 * 响应接口日志记录
 */
function _reslog(res) {
	let _statusCode = res.statusCode;
	if (process.env.NODE_ENV === 'development') {
		console.log("【" + new Date().toTimeString() + "】 结果：" + JSON.stringify(res.data))
	}
	//TODO 除了接口服务错误外，其他日志调接口异步写入日志数据库
	switch (_statusCode) {
		case 200:
			break;
		case 401:
			break;
		case 404:
			break;
		default:
			break;
	}
}

function handleServiceError(code, message) {
	if (code === -2 || code === -3 || code === -4 || code === -5) {
		// 跳转在路由钩子中统一控制
		uni.showToast({
			title: '您的登录状态过期',
			icon: 'none',
			duration: 3000
		})
	} else if (code === -1) {
		store.dispatch('clear').then(() => {
			// 跳转在路由钩子中统一控制
			uni.showToast({
				title: '请您在登录后使用',
				icon: 'none',
				duration: 3000
			})
		})
	} else if (code === 500) {
		uni.showModal({
			title: '提示',
			content: '服务器错误，系统异常，请稍后重试',
			showCancel: false,
			confirmText: 'Error',
			success(res) {
				if (res.confirm) {
					// 重定向到登录页面
					uni.showToast({
						title: '系统错误',
						icon: 'none'
					})
				}
			}
		})
	}
}