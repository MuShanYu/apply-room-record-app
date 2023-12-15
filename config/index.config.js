const CONFIG = {
    // 开发环境配置
    development: {
        assetsPath: '/static', // 静态资源路径
        baseUrl: 'http://localhost:8500', // 后台接口请求地址
        hostUrl: 'http://localhost:8600', // H5地址(前端运行地址)
    },
    // 生产环境配置
    production: {
        assetsPath: '/static', // 静态资源路径
        baseUrl: 'https://101.42.135.147:8500', // 后台接口请求地址
        hostUrl: 'https://101.42.135.147:8500', // H5地址(前端运行地址)
    }
};
export default CONFIG[process.env.NODE_ENV];
