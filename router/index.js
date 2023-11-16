import {RouterMount,createRouter} from 'uni-simple-router';

const witeList = ['/pages/home/index', '/pages/public/login', '/pages/public/register',
	'/pages/public/forget-pwd']

const router = createRouter({
	platform: process.env.VUE_APP_PLATFORM,  
	routes: [...ROUTES]
});
//全局路由前置守卫
router.beforeEach((to, from, next) => {
	// if (process.env.NODE_ENV === 'development') { 
	// 	console.log('to:' + to.path);
	// 	console.log('from:' + from.path);
	// }
	// const hasLogin = uni.getStorageSync('token')
	// if (!hasLogin) {
	// 	// 是否是在白名单中的界面
	// 	if (witeList.indexOf(to.path) !== -1) {
	// 		next()
	// 	} else {
	// 		uni.showToast({
	// 			title:'请先登录, 3s后跳转至登录界面',
	// 			icon:'none'
	// 		})
	// 		setTimeout(() => {
	// 			uni.reLaunch({
	// 				url: '/pages/public/login'
	// 			})
	// 		}, 3000)
	// 		next(false)
	// 	}
	// } else {
	// 	next()
	// }
	next()
});
// 全局路由后置守卫
router.afterEach((to, from) => {
    
})

export {
	router,
	RouterMount
}