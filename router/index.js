import {
	RouterMount,
	createRouter
} from 'uni-simple-router';
import user, {
	refreshTokenApi
} from '@/api/user.js'
import store from '@/store/index.js'
const witeList = ['/pages/public/login', '/pages/public/register',
	'/pages/public/forget-pwd', '/pages/index/index'
]

const router = createRouter({
	platform: process.env.VUE_APP_PLATFORM,
	applet: {
		animationDuration: 300 //默认 300ms  v2.0.6+
	},
	routes: [...ROUTES]
});
//全局路由前置守卫
router.beforeEach((to, from, next) => {
	if (process.env.NODE_ENV === 'development') {
		console.log('to:' + to.path);
		console.log('from:' + from.path);
	}
	const token = uni.getStorageSync('token')
	const userInfo = uni.getStorageSync('userInfo')
	if (!token && !userInfo) {
		// 是否是在白名单中的界面
		// console.log(to.path, "aaaaaaaaaaaaaa", typeof witeList.indexOf(to.path), typeof -1);
		if (witeList.indexOf(to.path) !== -1) {
			next()
		} else {
			// 处理未登录的情况，
			// 1. 如果缓存中没有token，代表没有登录
			// 2. 已经有token，向服务器提交并进行验证，服务器会判断是否过期，如果过期会对token进行续期
			next({
				path: '/pages/public/login'
			})
		}
	} else {
		// 无痛刷新token
		// token存在，说明userinfo也存在，校验token有效期
		let userId = userInfo.id
		refreshTokenApi(userId, token).then(res => {
			if (res.isNeedRefresh) {
				store.dispatch('refreshToken', res.token).then(() => {
					uni.showToast({
						title: '已为您续期会话, 请重新进入界面',
						icon: 'none'
					})
				})
			}
		}).catch(e => {
			console.log(e);
		})
		next()
	}
});
// 全局路由后置守卫
router.afterEach((to, from) => {

})

export {
	router,
	RouterMount
}