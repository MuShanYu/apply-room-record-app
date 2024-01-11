<template>
	<view class="template-bubble">

		<!-- 顶部自定义导航 -->
		<tn-nav-bar fixed alpha customBack>
			<view slot="back" class='tn-custom-nav-bar__back' @click="goBack">
				<text class='icon tn-icon-left'></text>
			</view>
		</tn-nav-bar>

		<canvas canvas-id="bubble" id="bubble" class="bubble"
			:style="{width: `${windowWidth}px`, height: `${windowHeight}px`}"></canvas>

		<view class="container about-bg">

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
		onReady() {
			this.$nextTick(() => {
				this.ctx = uni.createCanvasContext("bubble", this)
			})
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

		.bubble {
			position: fixed;
			bottom: -10vh;
			right: 0;
			z-index: 1024;
			pointer-events: none;
			// background-color: red;
		}
	}


	.about-bg {
		background-size: cover;
		width: 100vw;
		height: 100vh;
		justify-content: center;
		flex-direction: column;
		color: #fff;
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
		text-align: center;
	}
</style>