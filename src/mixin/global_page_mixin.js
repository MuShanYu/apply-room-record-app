/**
 * 演示页面mixin
 */
export default {
	data() {
		return {

		}
	},
	onLoad() {
		// 更新顶部导航栏信息
		this.updateCustomBarInfo()
	},
	onShareAppMessage() {
		// 开启分享功能，使用默认小程序名称，当前页面截图
	},
	onShareTimeline() {
		// 开启朋友圈分享功能，使用默认小程序名称，小程序logo
	},
	methods: {
		// 点击左上角返回按钮时触发事件
		goBack() {
			// 通过判断当前页面的页面栈信息，是否有上一页进行返回，如果没有则跳转到首页
			const pages = getCurrentPages()
			if (pages && pages.length > 0) {
				const firstPage = pages[0]
				if (pages.length == 1 && (!firstPage.route || firstPage.route != 'pages/index')) {
					uni.reLaunch({
						url: '/pages/index'
					})
				} else {
					uni.navigateBack({
						delta: 1
					})
				}
			} else {
				uni.reLaunch({
					url: '/pages/index'
				})
			}
		},
		// 更新顶部导航栏信息
		async updateCustomBarInfo() {
			// 获取vuex中的自定义顶栏的高度
			let customBarHeight = this.vuex_custom_bar_height
			let statusBarHeight = this.vuex_status_bar_height
			// 如果获取失败则重新获取
			if (!customBarHeight) {
				try {
					const navBarInfo = await this.$tn.updateCustomBar()
					customBarHeight = navBarInfo.customBarHeight
					statusBarHeight = navBarInfo.statusBarHeight
				} catch (e) {
					setTimeout(() => {
						this.updateCustomBarInfo()
					}, 10)
					return
				}
			}

			// 更新vuex中的导航栏信息
			this.$tn.vuex('vuex_status_bar_height', statusBarHeight)
			this.$tn.vuex('vuex_custom_bar_height', customBarHeight)
		},
		// 错误处理
		handleError(e) {
			if (e.success === false) {
				this.message = e.message
				this.showServiceErrorModal = true
			}
		}
	}
}