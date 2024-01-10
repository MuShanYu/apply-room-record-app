<template>
	<view class="page-e tn-safe-area-inset-bottom">
		<!-- <view class="top-backgroup">
			<image src='https://mushanyu-app-arr.oss-cn-beijing.aliyuncs.com/static/background/my-bg4.png' mode='widthFix'
				class='backgroud-image'></image>
		</view> -->


		<!-- 图标logo/头像 -->
		<view v-if="isLogin" class="tn-padding-left tn-padding-right tn-padding-bottom tn-bg-white"
			:style="{paddingTop: vuex_custom_bar_height + 'px'}">
			<view class="tn-flex tn-flex-row-between tn-flex-col-center tn-margin-bottom"
				@click="tn('/sub-page-profile/profile/profile-detail/index')">
				<view class="justify-content-item">
					<view class="tn-flex tn-flex-col-center tn-flex-row-left">
						<view class="logo-pic tn-shadow">
							<view class="logo-image">
								<view class="tn-shadow-blur" :style="{backgroundImage: 'url(' + randomHeader + ');'}"
									style="width: 110rpx;height: 110rpx;background-size: cover;overflow: hidden;">
								</view>
							</view>
						</view>
						<view class="tn-padding-right">
							<view class="tn-padding-right tn-padding-left-sm tn-flex tn-flex-col-center">
								<view class="tn-color-wallpaper tn-text-xl tn-text-bold">{{userInfo.name}}</view>
								<view class="tn-text-xs tn-color-white" :style="{backgroundColor: isBindWx ? '#39b54a' : '#aaaaaa'}"
									style="padding: 6rpx;margin-left: 15rpx;border-radius: 16rpx;">
									<text>{{isBindWx ? '微信已绑定' : '微信未绑定'}}</text>
								</view>
							</view>
							<view class="tn-padding-right tn-padding-top-sm tn-padding-left-sm tn-text-ellipsis">
								<text class="tn-color-gray">{{role}}</text>
								<text class="tn-color-gray tn-padding-left-sm tn-text-sm">{{mail}}</text>
							</view>
						</view>

					</view>
				</view>
				<view class="justify-content-item">
					<view class="tn-icon-install tn-color-gray tn-text-xxl">
					</view>
				</view>
			</view>
		</view>

		<!-- 未登录 -->
		<view v-if="!isLogin" class="tn-flex tn-flex-row-between" @click="tn('/pages/public/login')"
			:style="{paddingTop: vuex_custom_bar_height + 'px'}">
			<view class="tn-flex-1 justify-content-item tn-margin-xs tn-text-center">
				<tn-button shape="round" backgroundColor="#3668FC" fontColor="#ffffff" padding="20rpx 0" width="40%" shadow>
					<text class="tn-icon-wechat-fill tn-padding-right-xs tn-text-xl"></text>
					<text class="">授权登录</text>
				</tn-button>
			</view>
		</view>

		<view v-if="isLogin" class="tn-flex tn-flex-row-between tn-padding tn-bg-white" style="margin-top: 20rpx;">
			<view @click="tn('/sub-page-profile/profile/apply-room-process/index')" class="">
				<view class="tn-flex tn-flex-row-center tn-flex-col-center icon">
					<view class="tn-icon-clock-fill"></view>
				</view>
				<view class="tn-text-center tn-margin-top-xs">
					<text class="tn-text-ellipsis menu-text">预约进程</text>
				</view>
			</view>
			<view @click="tn('/sub-page-profile/profile/application-process/index')" class="">
				<view class="tn-flex tn-flex-row-center tn-flex-col-center icon">
					<view class="tn-icon-task-fill"></view>
				</view>
				<view class="tn-text-center tn-margin-top-xs">
					<text class="tn-text-ellipsis menu-text">申请进程</text>
				</view>
			</view>
			<view @click="tn('/sub-page-profile/profile/attendance/index')" class="">
				<view class="tn-flex tn-flex-row-center tn-flex-col-center icon">
					<view class="tn-icon-location-fill"></view>
				</view>
				<view class="tn-text-center tn-margin-top-xs">
					<text class="tn-text-ellipsis menu-text">签到详情</text>
				</view>
			</view>
			<view class="">
				<view class="tn-flex tn-flex-row-center tn-flex-col-center icon">
					<view class="tn-icon-safe-fill"></view>
				</view>
				<view class="tn-text-center tn-margin-top-xs">
					<text class="tn-text-ellipsis menu-text">账号安全</text>
				</view>
			</view>
		</view>

		<view v-if="isLogin" class="tn-padding tn-bg-white" style="margin-top: 20rpx;">
			<view class="">
				<button class="tn-flex tn-flex-row-between tn-button--clear-style" open-type="contact">
					<view class="tn-flex">
						<view style="color: #4B98FE;" class="tn-icon-team-fill tn-margin-right tn-text-lg cell menu-icon_cell">
						</view>
						<view class="cell tn-text-lg">
							<text class="menu-text_cell">在线客服</text>
						</view>
					</view>
					<view class="tn-color-gray cell">
						<view class="tn-icon-right"></view>
					</view>
				</button>
			</view>
			<view class="tn-flex tn-flex-row-between menu-item">
				<view class="tn-flex">
					<view style="color: #FFAC00;" class="tn-icon-bookmark-fill tn-margin-right tn-text-lg cell menu-icon_cell">
					</view>
					<view class="cell tn-text-lg">
						<text class="menu-text_cell">关于我们</text>
					</view>
				</view>
				<view class="tn-color-gray cell">
					<view class="tn-icon-right"></view>
				</view>
			</view>
		</view>

		<view v-if="isLogin" class="tn-margin-top tn-bg-white tn-padding" style="margin-top: 20rpx;">
			<view class="">
				<button class="tn-flex tn-flex-row-between tn-button--clear-style" open-type="feedback">
					<view class="tn-flex">
						<view style="color: #FE871B;" class="tn-icon-tip-fill tn-margin-right tn-text-lg cell menu-icon_cell">
						</view>
						<view class="cell tn-text-lg">
							<text class="menu-text_cell">问题反馈</text>
						</view>
					</view>
					<view class="tn-color-gray cell">
						<view class="tn-icon-right"></view>
					</view>
				</button>
			</view>
			<view class="tn-flex tn-flex-row-between menu-item">
				<view class="tn-flex">
					<view style="color: #9c26b0;" class="tn-icon-help-fill tn-margin-right tn-text-lg cell menu-icon_cell"></view>
					<view class="cell tn-text-lg">
						<text class="menu-text_cell">帮助中心</text>
					</view>
				</view>
				<view class="tn-color-gray cell">
					<view class="tn-icon-right"></view>
				</view>
			</view>
			<view class="tn-flex tn-flex-row-between menu-item">
				<view class="tn-flex">
					<view style="color: #00C8B0;" class="tn-icon-up-fill tn-margin-right tn-text-lg cell menu-icon_cell"></view>
					<view class="cell tn-text-lg">
						<text class="menu-text_cell">版本更新</text>
					</view>
				</view>
				<view class="tn-color-gray cell">
					<view class="tn-icon-right"></view>
				</view>
			</view>
		</view>

		<view class="tn-margin-top-xl tn-text-center tn-color-gray">
			© MuShanYu
		</view>


		<view class='tn-tabbar-height'></view>
		<view class="bg-tabbar-shadow"></view>
	</view>
</template>

<script>
	import STATIC_CONFIG from '@/config/static.config.js'
	export default {
		data() {
			return {
				isLogin: false,
				userInfo: '',
				isBindWx: false,
				role: '',
				mail: '',
				randomHeader: ''
			}
		},
		mounted() {
			this.onShowMethod()
			uni.$on('infoUpdate', () => {
				this.onShowMethod()
			})
		},
		methods: {
			onShowMethod() {
				this.isLogin = uni.getStorageSync('token') ? true : false
				this.userInfo = uni.getStorageSync('userInfo') || null
				this.isBindWx = uni.getStorageSync('isBindWx') || false
				if (uni.getStorageSync('roles')) {
					let roles = uni.getStorageSync('roles')
					if (roles.includes('super-admin')) {
						this.role = '超级管理员'
					} else if (roles.includes('admin')) {
						this.role = '管理员'
					} else {
						this.role = '普通用户'
					}
				}
				if (this.userInfo !== null) {
					this.mail = this.userInfo.mail.replace(/(.{0,3}).*@(.*)/, "$1***@$2")
				}
				let index = Math.floor(Math.random() * 6)
				this.randomHeader = STATIC_CONFIG.headerImage[index]
			},
			tn(page) {
				let that = this
				if (page === '/sub-page-profile/profile/profile-detail/index') {
					this.$Router.push({
						path: page,
						query: {
							headerImage: that.randomHeader
						}
					})
				} else {
					this.$Router.push(page)
				}
			}
		}
	}
</script>

<style lang="scss" scoped>
	/* 底部安全边距 start*/
	.tn-tabbar-height {
		min-height: 120rpx;
		height: calc(140rpx + env(safe-area-inset-bottom) / 2);
		height: calc(140rpx + constant(safe-area-inset-bottom));
	}

	/* 底部tabbar假阴影 start*/
	.bg-tabbar-shadow {
		// background-image: repeating-linear-gradient(to top, rgba(0,0,0,0.1) 10rpx, rgba(255,255,255,0) , rgba(255,255,255,0));
		box-shadow: 0rpx 0rpx 400rpx 0rpx rgba(0, 0, 0, 0.25);
		position: fixed;
		bottom: calc(0rpx + env(safe-area-inset-bottom) / 2);
		bottom: calc(0rpx + constant(safe-area-inset-bottom));
		height: 60rpx;
		width: 100vw;
		z-index: 0;
	}

	.page-e {
		max-height: 100vh;
	}

	.icon {
		font-size: 48rpx;
		color: #3668FC;
	}

	.cell {
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.menu-item {
		margin-top: 70rpx;
	}

	.menu-text {
		font-size: 23rpx;
	}

	.menu-text_cell {
		font-size: 28rpx;
	}

	.menu-icon_cell {
		font-size: 38rpx;
	}


	/* 顶部背景图 start */
	.top-backgroup {
		height: 450rpx;
		z-index: -1;

		.backgroud-image {
			width: 100%;
			height: 450rpx;
			// z-index: -1;
		}
	}

	/* 顶部背景图 end */

	.logo-pic {
		background-size: cover;
		background-repeat: no-repeat;
		// background-attachment:fixed;
		background-position: top;
		border: 8rpx solid rgba(255, 255, 255, 0.05);
		box-shadow: 0rpx 0rpx 80rpx 0rpx rgba(0, 0, 0, 0.15);
		border-radius: 50%;
		overflow: hidden;
		// background-color: #FFFFFF;
	}

	/* 用户头像 start */
	.logo-image {
		width: 110rpx;
		height: 110rpx;
		position: relative;
		overflow: hidden;
		border-radius: 50%;
	}

	/* 页面阴影 start*/
	.wallpaper-shadow {
		border-radius: 15rpx;
		box-shadow: 0rpx 0rpx 50rpx 0rpx rgba(0, 0, 0, 0.07);
	}

	.icon12 {
		&__item {
			width: 30%;
			background-color: #FFFFFF;
			border-radius: 10rpx;
			padding: 30rpx;
			margin: 20rpx 10rpx;
			transform: scale(1);
			transition: transform 0.3s linear;
			transform-origin: center center;

			&--icon {
				width: 15rpx;
				height: 15rpx;
				font-size: 50rpx;
				border-radius: 50%;
				margin-bottom: 38rpx;
				position: relative;
				z-index: 1;

				&::after {
					content: " ";
					position: absolute;
					z-index: -1;
					width: 100%;
					height: 100%;
					left: 0;
					bottom: 0;
					border-radius: inherit;
					opacity: 1;
					transform: scale(1, 1);
					background-size: 100% 100%;

				}
			}
		}
	}

	.box-shadow {
		// border-radius: 15rpx;
		box-shadow: 0rpx 0rpx 50rpx 0rpx rgba(0, 0, 0, 0.07);
		// position: relative;
	}
</style>