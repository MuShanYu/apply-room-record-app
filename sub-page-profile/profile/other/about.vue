<template>
	<view class="template-bubble">

		<!-- 顶部自定义导航 -->
		<tn-nav-bar fixed alpha customBack>
			<view slot="back" class='tn-custom-nav-bar__back' @click="goBack">
				<text class='icon tn-icon-left'></text>
			</view>
		</tn-nav-bar>

		<view :style="{marginTop: vuex_custom_bar_height + 'px'}" class="container about-bg tn-text-white tn-padding"
			style="font-size: 32rpx;line-height: 1.5;">
			<view class="" style="text-indent: 30rpx;">
				您好Ya！欢迎使用我们的房间预约与流动统计应用！感谢您的使用与支持！
			</view>
			<view style="text-indent: 30rpx;" class="tn-margin-top-sm tn-margin-bottom-sm">
				我们的项目于2022年8月9日启动，并发布了首个H5版本，历时2年迭代。
			</view>
			<view style="text-indent: 30rpx;" class="tn-margin-bottom-sm">
				随着需求变更和产品迭代，我们正式推出了小程序版本。我们希望这款应用能为您带来优质的服务与使用体验。
			</view>
			<view class="tn-text-right">
				@MuShanYu
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				windowHeight: 0,
				windowWidth: 0,
				ctx: null
			}
		},
		onLoad() {
			this.getSystemInfo()
		},
		onUnload() {

		},
		methods: {
			// 获取系统信息
			getSystemInfo() {
				const systemInfo = uni.getSystemInfoSync()
				if (!systemInfo) {
					setTimeout(() => {
						this.getSystemInfo()
					}, 50)
					return
				}

				this.windowHeight = systemInfo.safeArea.height
				this.windowWidth = systemInfo.safeArea.width
			},
		}
	}
</script>

<style lang="scss" scoped>
	.tn-custom-nav-bar__back {
		width: 80%;
		height: 100%;
		position: relative;
		display: flex;
		justify-content: space-evenly;
		align-items: center;
		box-sizing: border-box;
		background-color: rgba(0, 0, 0, 0.2);
		border-radius: 1000rpx;
		border: 1rpx solid rgba(255, 255, 255, 0.5);
		color: #FFFFFF;
		font-size: 18px;

		.icon {
			display: block;
			flex: 1;
			margin: auto;
			text-align: center;
		}

		&:before {
			width: 1rpx;
			height: 110%;
			position: absolute;
			top: 22.5%;
			left: 0;
			right: 0;
			margin: auto;
			transform: scale(0.5);
			transform-origin: 0 0;
			pointer-events: none;
			box-sizing: border-box;
			opacity: 0.7;
			background-color: #FFFFFF;
		}
	}

	.logo-pic {
		background-size: cover;
		background-repeat: no-repeat;
		background-attachment: fixed;

	}

	.logo-image {
		width: 100%;
		height: 100%;
		position: relative;
	}

	.template-bubble {
		margin: 0;
		width: 100%;
		height: 100vh;
		color: #fff;
		background: linear-gradient(-120deg, #F15BB5, #9A5CE5, #01BEFF, #00F5D4);
		/* background: linear-gradient(-120deg,  #9A5CE5, #01BEFF, #00F5D4, #43e97b); */
		/* background: linear-gradient(-120deg,#c471f5, #ec008c, #ff4e50,#f9d423); */
		/* background: linear-gradient(-120deg, #0976ea, #c471f5, #f956b6, #ea7e0a); */
		background-size: 500% 500%;
		animation: gradientBG 15s ease infinite;

		position: relative;
	}




	@keyframes gradientBG {
		0% {
			background-position: 0% 50%;
		}

		50% {
			background-position: 100% 50%;
		}

		100% {
			background-position: 0% 50%;
		}
	}

	.container {
		width: 100%;
		position: absolute;
	}
</style>