const CONFIG = {
	// 开发环境配置
	development: {
		baseUrl: 'http://127.0.0.1:8500', // 后台接口请求地址
		socketUrl: 'ws://127.0.0.1:9500/websocket',
		loginExpiredTime: 1800000 // 登录过期时间,单位毫秒
	},
	// 生产环境配置
	production: {
		baseUrl: 'https://ip:8500', // 后台接口请求地址
		socketUrl: 'wss://ip:9500/websocket',
		loginExpiredTime: 604800000 // 登录过期时间,单位毫秒 7天
	}
};
export default CONFIG[process.env.NODE_ENV];