<template>
	<view class="page">

		<view class="tn-margin-top-lg" :style="{marginTop: vuex_custom_bar_height + 'px'}">
			<view class="nav_title--wrap">
				<view class="nav_title tn-cool-bg-color-5">
					<text class="tn-icon-calendar tn-padding-right-sm"></text>
					预 / 约 / 与 / 申 / 请
					<text class="tn-icon-calendar tn-padding-left-sm"></text>
				</view>
			</view>
		</view>

		<view class='nav-list tn-margin-bottom tn-margin-top'>

			<view @click="tn('/pages/sub-page/work/apply-room/index')"
				class="nav-list-item tn-shadow-blur tn-cool-bg-image home-shadow">
				<view class="nav-link">
					<view class='title tn-text-bold' style="color: #080808;">房间预约</view>
					<view class='join'></view>
				</view>
				<view class="icon tn-shadow-blur tn-bg-blue">
					<view class="tn-icon-home-capsule-fill"></view>
				</view>
			</view>

			<view class="nav-list-item tn-shadow-blur tn-cool-bg-image home-shadow">
				<view class="nav-link">
					<view class='title tn-text-bold' style="color: #080808;">补卡申请</view>
					<view class='join'></view>
				</view>
				<view class="icon tn-shadow-blur tn-main-gradient-orangered">
					<view class="tn-icon-order-fill"></view>
				</view>
			</view>

		</view>

		<view class="tn-margin-top-lg">
			<view class="nav_title--wrap">
				<view class="nav_title tn-cool-bg-color-15">
					<text class="tn-icon-circle-more tn-padding-right-sm"></text>
					事 / 项 / 审 / 批
					<text class="tn-icon-circle-more tn-padding-left-sm"></text>
				</view>
			</view>
		</view>

		<view class='nav-list tn-margin-bottom tn-margin-top'>

			<view @click="tn('/pages/sub-page/work/approve-room/index')"
				class="nav-list-item tn-shadow-blur tn-cool-bg-image home-shadow">
				<view class="nav-link">
					<view class='title tn-text-bold' style="color: #080808;">预约审批</view>
					<view class='join'></view>
				</view>
				<view class="icon tn-shadow-blur tn-cool-bg-color-9">
					<view class="tn-icon-success-circle-fill"></view>
				</view>
			</view>

			<view class="nav-list-item tn-shadow-blur tn-cool-bg-image home-shadow">
				<view class="nav-link">
					<view class='title tn-text-bold' style="color: #080808;">补卡审批</view>
					<view class='join'></view>
				</view>
				<view class="icon tn-shadow-blur tn-main-gradient-purplered">
					<view class="tn-icon-task-fill"></view>
				</view>
			</view>

		</view>
		<tn-toast ref="toast"></tn-toast>

		<view class='tn-tabbar-height'></view>
		<view class="bg-tabbar-shadow"></view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				adminPage: [
					'/pages/sub-page/work/approve-room/index'
				]
			}
		},
		methods: {
			tn(page) {
				if (uni.getStorageSync('roles') && this.adminPage.some(item => item === page)) {
					let roles = uni.getStorageSync('roles')
					let flag = roles.some(item => item === 'admin') || roles.some(item => item === 'super-admin')
					if (!flag) {
						this.$refs.toast.show({
							title: '无权限访问'
						})
						return
					}
				}
				this.$Router.push(page)
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

	/* 标题 start */
	.nav_title {
		-webkit-background-clip: text;
		color: transparent;

		&--wrap {
			position: relative;
			display: flex;
			height: 120rpx;
			font-size: 42rpx;
			align-items: center;
			justify-content: center;
			font-weight: bold;
			background-image: url(https://mushanyu-app-arr.oss-cn-beijing.aliyuncs.com/static/background/title44.png);
			background-size: cover;
		}
	}

	/* 标题 end */

	/* 组件导航列表 start*/
	.nav-list {
		display: flex;
		flex-wrap: wrap;
		padding: 0rpx 12rpx 0rpx;
		justify-content: space-between;

		/* 列表元素 start */
		.nav-list-item {
			padding: 95rpx 30rpx 5rpx 30rpx;
			border-radius: 12rpx;
			width: 45%;
			margin: 0 18rpx 40rpx;
			background-size: cover;
			background-position: center;
			position: relative;
			z-index: 99;

			/* 元素标题 start */
			.nav-link {
				font-size: 32rpx;
				text-transform: capitalize;
				padding: 0 0 10rpx 0;
				position: relative;

				.title {
					color: #FFFFFF;
					margin-top: 100rpx;
					text-align: center;
				}

				.join {
					color: #FFFFFF;
					margin-top: 20rpx;
					margin-bottom: 40rpx;
					text-align: center;
				}
			}

			/* 元素标题 end */

			/* 元素图标 start */
			.icon {
				font-variant: small-caps;
				position: absolute;
				top: 60rpx;
				right: 50rpx;
				left: 37%;
				width: 90rpx;
				height: 90rpx;
				line-height: 90rpx;
				margin: 0;
				padding: 0;
				display: inline-flex;
				text-align: center;
				justify-content: center;
				vertical-align: middle;
				font-size: 50rpx;
				color: #FFFFFF;
				white-space: nowrap;
				opacity: 0.9;
				background-color: rgba(0, 0, 0, 0.05);
				background-size: cover;
				background-position: 50%;
				border-radius: 5000rpx;

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
					background-image: url(https://mushanyu-app-arr.oss-cn-beijing.aliyuncs.com/static/background/icon_bg2.png);
				}
			}

			/* 元素图标 end */
		}

		/* 列表元素 end */
	}

	/* 组件导航列表 end*/

	/* 阴影 start*/
	.home-shadow {
		border-radius: 15rpx;
		box-shadow: 0rpx 0rpx 50rpx 0rpx rgba(0, 0, 0, 0.07);
	}
</style>