<template>
	<view class="page">
		<tn-nav-bar
			fixed
			:isBack="false"
			:bottomShadow="false"
			backgroundColor="#FFFFFF">
			<view slot="default" class=""> 应用服务 </view>
		</tn-nav-bar>
		<view
			:style="{ marginTop: vuex_custom_bar_height + 'px' }"
			class="">
			<view style="border-bottom-left-radius: 15rpx;border-bottom-right-radius: 15rpx;" class="home-shadow tn-padding">
				<view class="tn-text-bold tn-flex" style="font-size:32rpx;margin-bottom:10rpx;">
					<view style="background-color: #3d79fe;width:6rpx;margin-right:12rpx;border-radius: 20rpx;">

					</view>
					<view>预约服务</view>
				</view>
				<view class="tn-flex" style="padding-bottom:20rpx;">
					<view
						style="margin: 30rpx 30rpx 30rpx 0rpx"
						@click="tn('/page-work/apply-room/index')">
						<view
							class="nav-list-item tn-shadow-blur tn-cool-bg-image tn-text-center">
							<view class="icon tn-shadow-blur tn-bg-blue">
								<view class="tn-icon-home-capsule-fill"></view>
							</view>
						</view>
						<view style="font-size:26rpx;" class="tn-margin-top-sm"> 房间预约 </view>
					</view>
					<view
						style="margin: 30rpx 30rpx 30rpx 60rpx"
						@click="tn('/page-work/sign-in-apply/index')">
						<view
							class="nav-list-item tn-shadow-blur tn-cool-bg-image tn-text-center">
							<view class="icon tn-shadow-blur tn-main-gradient-orangered">
								<view class="tn-icon-order-fill"></view>
							</view>
						</view>
						<view style="font-size:26rpx;" class="tn-margin-top-sm"> 补卡申请 </view>
					</view>
				</view>
			</view>

			<view style="margin:18rpx 0 18rpx 0;border-radius: 15rpx;" class="home-shadow tn-padding">
				<view class="tn-text-bold tn-flex" style="font-size:32rpx;margin-bottom:10rpx;">
					<view style="background-color: #3d79fe;width:6rpx;margin-right:12rpx;border-radius: 20rpx;">

					</view>
					<view>审批服务</view>
				</view>
				<view class="tn-flex" style="padding-bottom:20rpx;">
					<view
						style="margin: 30rpx 30rpx 30rpx 0rpx;"
						@click="tn('/page-work/approve-room/index')">
						<view
							class="nav-list-item tn-shadow-blur tn-cool-bg-image tn-text-center">
							<view class="icon tn-shadow-blur tn-cool-bg-color-9">
								<view class="tn-icon-success-circle-fill"></view>
							</view>
						</view>
						<view style="font-size:26rpx;" class="tn-margin-top-sm"> 预约审批 </view>
					</view>
					<view
						style="margin: 30rpx 30rpx 30rpx 60rpx;"
						@click="tn('/page-work/sign-in-approve/index')">
						<view
							class="nav-list-item tn-shadow-blur tn-cool-bg-image tn-text-center">
							<view class="icon tn-shadow-blur tn-main-gradient-purplered">
								<view class="tn-icon-task-fill"></view>
							</view>
						</view>
						<view style="font-size:26rpx;" class="tn-margin-top-sm"> 补卡审批 </view>
					</view>
				</view>
			</view>

			<view style="border-radius: 15rpx;" class="home-shadow tn-padding">
				<view class="tn-text-bold tn-flex" style="font-size:32rpx;margin-bottom:10rpx;">
					<view style="background-color: #3d79fe;width:6rpx;margin-right:12rpx;border-radius: 20rpx;">

					</view>
					<view>其它服务</view>
				</view>
				<view class="tn-flex">
					<view
						style="margin: 30rpx 30rpx 30rpx 0rpx"
						@click="tn('/page-work/sign-in/index')">
						<view
							class="nav-list-item tn-shadow-blur tn-cool-bg-image tn-text-center">
							<view class="icon tn-shadow-blur tn-main-gradient-red--reverse">
								<view class="tn-icon-login"></view>
							</view>
						</view>
						<view style="font-size:26rpx;" class="tn-margin-top-sm"> 房间签到 </view>
					</view>
				</view>
			</view>
		</view>

		<tn-toast ref="toast"></tn-toast>

		<view class="tn-tabbar-height"></view>
		<view class="bg-tabbar-shadow"></view>
	</view>
</template>

<script>
export default {
	data() {
		return {
			adminPage: [
				"/page-work/approve-room/index",
				"/page-work/sign-in-approve/index",
			],
		};
	},
	methods: {
		tn(page) {
			let permissions = uni.getStorageSync("permissions");
			if (!permissions) {
				this.$refs.toast.show({
					title: "权限信息为空，请重新登录",
				});
				return;
			}
			if (page === this.adminPage[0]) {
				if (
					!permissions.some((item) => item === "system:room:wxSignInApprove")
				) {
					this.$refs.toast.show({
						title: "无权限访问",
					});
					return;
				}
			} else if (page === this.adminPage[1]) {
				if (
					!permissions.some((item) => item === "system:room:wxSignInApprove")
				) {
					this.$refs.toast.show({
						title: "无权限访问",
					});
					return;
				}
			}
			this.$Router.push(page);
		},
	},
};
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

/* 列表元素 start */
.nav-list-item {
	// padding: 95rpx 30rpx 5rpx 30rpx;
	border-radius: 12rpx;
	// border: 1px solid red;
	// width: 45%;
	// margin: 0 18rpx 40rpx;
	background-size: cover;
	background-position: center;
	position: relative;
	z-index: 99;

	/* 元素标题 end */

	/* 元素图标 start */
	.icon {
		font-variant: small-caps;
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
		color: #ffffff;
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

/* 阴影 start*/
.home-shadow {
	// 
	box-shadow: 0rpx 0rpx 50rpx 0rpx rgba(0, 0, 0, 0.07);
	background-color: #ffffff;
}
</style>
