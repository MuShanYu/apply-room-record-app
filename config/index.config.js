const CONFIG = {
	// 开发环境配置
	development: {
		assetsPath: '/static', // 静态资源路径
		baseUrl: 'http://127.0.0.1:8500', // 后台接口请求地址
		socketUrl: 'ws://127.0.0.1:9500/websocket'
	},
	// 生产环境配置
	production: {
		assetsPath: '/static', // 静态资源路径
		baseUrl: 'https://www.mushanyu.top:8500', // 后台接口请求地址
		socketUrl: 'wss://www.mushanyu.top:9500/websocket'
	}
};
export default CONFIG[process.env.NODE_ENV];