const CONFIG = {
	// 开发环境配置
	development: {
		assetsPath: '/static', // 静态资源路径
		baseUrl: 'http://localhost:8500', // 后台接口请求地址
		socketUrl: 'ws://localhost:9500/websocket'
	},
	// 生产环境配置
	production: {
		assetsPath: '/static', // 静态资源路径
		baseUrl: 'https://ip:8500', // 后台接口请求地址
		socketUrl: 'wss://ip:9500/websocket'
	}
};
export default CONFIG[process.env.NODE_ENV];