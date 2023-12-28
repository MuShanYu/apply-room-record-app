const CONFIG = {
    // 开发环境配置
    development: {
        assetsPath: '/static', // 静态资源路径
        baseUrl: 'http://localhost:8500', // 后台接口请求地址
        // baseUrl: 'https://www.mushanyu.top:8500', // 后台接口请求地址
    },
    // 生产环境配置
    production: {
        assetsPath: '/static', // 静态资源路径
        // baseUrl: 'http://101.42.135.147:8500', // 后台接口请求地址
        baseUrl: 'https://www.mushanyu.top:8500', // 后台接口请求地址
    }
};
export default CONFIG[process.env.NODE_ENV];
