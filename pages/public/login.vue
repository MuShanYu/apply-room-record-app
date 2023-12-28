<template>
	<view class="template-login" style="background-color: #FFFFFF;min-height: 100vh;">
		<!-- 顶部自定义导航 -->
		<tn-nav-bar fixed alpha customBack>
			<view slot="back" class='tn-custom-nav-bar__back' @click="goBack">
				<text class='icon tn-icon-left'></text>
			</view>
		</tn-nav-bar>

		<view class="login login-fixed">

			<view class="login__wrapper">
				<view class="tn-margin-left tn-margin-right tn-text-bold" style="font-size: 48rpx;">
					房间预约与流动统计
				</view>
				<view class="tn-margin tn-color-gray--dark tn-text-sm">
					这是一句很厉害的App介绍！
				</view>
				<!-- 输入框内容-->
				<view class="login__info tn-flex tn-flex-direction-column tn-flex-col-center tn-flex-row-center">
					<!-- 登录 -->
					<block>
						<view
							class="login__info__item__input tn-flex tn-flex-direction-row tn-flex-nowrap tn-flex-col-center tn-flex-row-left">
							<view class="login__info__item__input__left-icon">
								<view class="tn-icon-identity"></view>
							</view>
							<view class="login__info__item__input__content">
								<input v-model="userLoginDTO.stuNum" maxlength="16" placeholder-class="input-placeholder"
									placeholder="请输入学号/工号登录" />
							</view>
						</view>

						<view
							class="login__info__item__input tn-flex tn-flex-direction-row tn-flex-nowrap tn-flex-col-center tn-flex-row-left">
							<view class="login__info__item__input__left-icon">
								<view class="tn-icon-lock"></view>
							</view>
							<view class="login__info__item__input__content">
								<input v-model="userLoginDTO.pwd" maxlength="32" :password="!showPassword"
									placeholder-class="input-placeholder" placeholder="请输入密码" />
							</view>
							<view class="login__info__item__input__right-icon" @click="showPassword = !showPassword">
								<view :class="[showPassword ? 'tn-icon-eye' : 'tn-icon-eye-hide']"></view>
							</view>
						</view>
					</block>

					<!-- 悬浮按钮-->
					<view class="tn-margin-top-lg" style="width: 100%;position: relative;">
						<view class="tn-margin-top-lg">
							<tn-button :loading='btnLoading' backgroundColor="#3668FC" padding="40rpx 0" width="100%" :fontSize="28"
								fontColor="#FFFFFF" @click="loginByTel">
								<text class="">登 录</text>
							</tn-button>
						</view>
					</view>

					<view class="login__info__item__tips">
						<view class="tn-flex tn-flex-row-between">
							<view class="tn-padding-right tn-color-gray" @tap="tn('/pages/public/register')">账号注册</view>
							<view class="tn-padding-left-lg tn-color-gray" @tap="tn('/pages/public/forget-pwd')">忘记密码?</view>
						</view>
					</view>

				</view>


				<view class="tn-footerfixed">

					<view class="tn-flex tn-flex-col-center tn-flex-row-center tn-text-center">
						<view class="" style="border-bottom: 1rpx solid #E6E6E6;width: 160rpx;"></view>
						<view class="tn-padding tn-text-sm" style="color: #E6E6E6;">快捷登录方式</view>
						<view class="" style="border-bottom: 1rpx solid #E6E6E6;width: 160rpx;"></view>
					</view>

					<!-- 方式13 start-->
					<view class="tn-flex tn-flex-row-center">
						<view class="tn-padding-sm tn-margin-sm tn-radius">
							<view class="tn-flex tn-flex-direction-column tn-flex-row-center tn-flex-col-center">
								<view @tap="showLoginModal = true"
									class="icon13__item--icon tn-flex tn-flex-row-center tn-flex-col-center tn-shadow-blur tn-main-gradient-green--light tn-color-green">
									<view class="tn-icon-wechat-fill tn-three"></view>
								</view>
							</view>
						</view>
					</view>
				</view>
			</view>
		</view>
		<tn-toast ref="toast"></tn-toast>
		<tn-modal @click="handleClickModal" :radius='40' v-model="showLoginModal" :title="'提示'"
			:content="'授权系统获取您的用户标识ID，方便您使用微信快捷登录App。'" :button="button"></tn-modal>
		<tn-modal @click="handleFalseModalClick" :radius='40' v-model="showFalseModal" :title="'抱歉，无法使用微信登录'"
			content="1.登陆后未绑定微信，请使用账号密码登陆后在账号中心绑定微信。2.您未注册并使用过本App，请注册后绑定微信。" :button="falseModalButton">
		</tn-modal>
		
		<tn-modal @click="showServiceErrorModal = false" :radius='40' v-model="showServiceErrorModal" :title="'系统提示'"
			:content="message" :button="serviceErrorModalButton">
		</tn-modal>
		<w-loading text="拼命处理中..." mask="true" click="true" ref="loading"></w-loading>
	</view>
</template>

<script>
	import {
		login,
		wxLogin
	} from '@/api/user.js'
	export default {
		name: 'login',
		onLoad() {

		},
		data() {
			return {
				// 是否显示密码
				showPassword: false,
				userLoginDTO: {
					stuNum: '',
					pwd: ''
				},
				btnLoading: false,
				showLoginModal: false,
				showFalseModal: false,
				button: [{
						text: '取消',
						backgroundColor: 'tn-bg-gray',
						fontColor: '#FFFFFF',
					},
					{
						text: '授权',
						backgroundColor: '#3668FC',
						fontColor: '#FFFFFF'
					}
				],
				falseModalButton: [{
					text: '我知道了',
					backgroundColor: '#3668FC',
					fontColor: '#FFFFFF',
				}],
				serviceErrorModalButton: [{
					text: '我知道了',
					backgroundColor: '#3668FC',
					fontColor: '#FFFFFF',
				}],
				showServiceErrorModal: false,
				message: '',
			}
		},
		watch: {
			currentModeIndex(value) {
				const sliderWidth = uni.upx2px(476 / 2)
				this.modeSliderStyle.left = `${sliderWidth * value}px`
			}
		},
		methods: {
			// 跳转
			tn(url) {
				this.$Router.push(url)
			},
			// 切换模式
			modeSwitch(index) {
				this.currentModeIndex = index
				this.showPassword = false
			},
			loginByTel() {
				let that = this
				// 校验
				if (this.userLoginDTO.stuNum.length < 5 || this.userLoginDTO.stuNum.length > 16) {
					this.$tn.mes
					this.$refs.toast.show({
						title: '请输入正确的学号',
						duration: 1000
					})
					return
				}
				if (this.userLoginDTO.pwd.length < 6 || this.userLoginDTO.pwd.length > 32) {
					this.$refs.toast.show({
						title: '密码的长度在6到32之间',
						duration: 1500
					})
					return
				}
				// console.log(this.userLoginDTO);
				this.btnLoading = true
				login(this.userLoginDTO).then(res => {
					this.btnLoading = false
					this.$store.dispatch('login', res).then(() => {
						this.$refs.toast.show({
							title: '登录成功，正在跳转',
							duration: 1500
						})
						setTimeout(() => {
							that.$Router.replaceAll('/pages/index/index')
						}, 1500)
					})
				}).catch(e => {
					this.btnLoading = false
					this.handleError(e)
				})
			},
			handleFalseModalClick(e) {
				this.showFalseModal = false
			},
			handleClickModal(e) {
				this.showLoginModal = false
				if (e.index === 1) {
					// 确定按钮
					this.handleWXLogin()
				}
			},
			handleWXLogin() {
				this.$refs.loading.open();
				let that = this
				uni.login({
					provider: 'weixin',
					scopes: '',
					success(res) {
						let code = res.code
						wxLogin(code).then(response => {
							that.$refs.loading.close()
							let canWxLogin = response.canWxLogin
							if (!canWxLogin) {
								that.showFalseModal = true
							} else {
								// 登录
								that.$store.dispatch('login', response).then(() => {
									that.$refs.toast.show({
										title: '登录成功，正在跳转',
										duration: 1500
									})
									setTimeout(() => {
										that.$Router.replaceAll('/pages/index/index')
									}, 1500)
								})
							}
						})
					},
					fail(e) {
						console.log(e);
						that.$refs.loading.close()
					}
				})
			},
			
		}
	}
</script>

<style lang="scss" scoped>
	/* 胶囊*/
	.tn-custom-nav-bar__back {
		width: 80%;
		height: 100%;
		position: relative;
		display: flex;
		justify-content: space-evenly;
		align-items: center;
		box-sizing: border-box;
		background-color: rgba(0, 0, 0, 0.15);
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

	}

	/* 悬浮 */
	/* .login-sussuspension{
    animation: suspension 3s ease-in-out infinite;
  }
  
  @keyframes suspension {
    0%, 100% {
      transform: translate(0 , 0);
    }
    50% {
      transform: translate(0rem , 1rem);
    }
  } */

	// 渐变底色
	.login-fixed {
		position: fixed;
		// background: linear-gradient(0deg, #F6DB4E00, #F6DB4EF2, #F6DB4E);
		background: linear-gradient(90deg, #FFFFFF, #FFFFFF, #DBF2FE, #DBF2FE);
		// background: linear-gradient(90deg, #FFFFFF, #FFFFFF, #FC3A7230, #FC3A7280);
		top: 0;
		width: 100%;
		transition: all 0.25s ease-out;
		z-index: 100;
		height: 400rpx;
	}

	.login-fixed:before {
		content: "";
		position: absolute;
		top: 0;
		left: 0;
		bottom: 0;
		right: 0;
		z-index: -1;
		mask-image: linear-gradient(to bottom, transparent, black);
		background: linear-gradient(90deg, #FFFFFF, #FFFFFF);

	}

	.login {
		position: relative;
		z-index: 1;

		/* 内容 start */
		&__wrapper {
			padding-top: 300rpx;
			width: 100%;
		}

		/* 切换 start */
		&__mode {
			position: relative;
			margin: 0 auto;
			width: 476rpx;
			height: 77rpx;
			margin-top: 100rpx;
			background-color: rgba(255, 255, 255, 0.6);
			box-shadow: 0rpx 10rpx 50rpx 0rpx rgba(0, 3, 72, 0.1);
			border-radius: 39rpx;

			&__item {
				height: 77rpx;
				width: 100%;
				line-height: 77rpx;
				text-align: center;
				font-size: 31rpx;
				color: #080808;
				letter-spacing: 1em;
				text-indent: 1em;
				z-index: 2;
				transition: all 0.4s;

				&--active {
					font-weight: bold;
					color: #FFFFFF;
				}
			}

			&__slider {
				position: absolute;
				height: inherit;
				width: calc(476rpx / 2);
				border-radius: inherit;
				box-shadow: 0rpx 18rpx 72rpx 18rpx rgba(0, 195, 255, 0.1);
				z-index: 1;
				transition: all 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55);
			}
		}

		/* 切换 end */

		/* 登录注册信息 start */
		&__info {
			margin: 80rpx 30rpx 10rpx 30rpx;
			padding-bottom: 0;
			border-radius: 20rpx;

			&__item {

				&__input {
					margin-top: 59rpx;
					width: 100%;
					height: 77rpx;
					border-bottom: 1rpx solid #E6E6E6;

					&__left-icon {
						font-size: 44rpx;
						padding: 10rpx 0rpx 30rpx 0rpx;
						color: #AAAAAA;
					}

					&__content {
						width: 90%;
						padding: 10rpx 0rpx 30rpx 10rpx;
						// padding-left: 10rpx;

						&--verify-code {
							width: 90%;
						}

						input {
							font-size: 32rpx;
							// letter-spacing: 0.1em;
						}
					}

					&__right-icon {
						width: 10%;
						font-size: 44rpx;
						margin-right: 0rpx;
						color: #AAAAAA;
						padding: 10rpx 0rpx 30rpx 0rpx;
					}

					&__right-verify-code {
						width: 28%;
						padding: 10rpx 0rpx 30rpx 0rpx;
					}
				}

				&__tips {
					margin: 30rpx 0;
					color: #AAAAAA;
				}
			}
		}

		/* 登录注册信息 end */
		/* 内容 end */

	}

	.tn-three {
		position: absolute;
		top: 50%;
		right: 50%;
		bottom: 50%;
		left: 50%;
		transform: translate(-38rpx, -16rpx) rotateX(30deg) rotateY(20deg) rotateZ(-30deg);
		text-shadow: -1rpx 2rpx 0 #f0f0f0, -2rpx 4rpx 0 #f0f0f0, -10rpx 20rpx 30rpx rgba(0, 0, 0, 0.2);
	}


	/* 图标容器13 start */
	.icon13 {
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
				width: 100rpx;
				height: 100rpx;
				font-size: 60rpx;
				border-radius: 50%;
				margin-bottom: 18rpx;
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
					background-image: url(https://mushanyu-app-arr.oss-cn-beijing.aliyuncs.com/static/background/icon_bg.png);
					// background-color: #FFFFFF;
				}
			}
		}
	}

	/* 底部悬浮按钮 start*/
	.tn-tabbar-height {
		min-height: 160rpx;
		height: calc(180rpx + env(safe-area-inset-bottom) / 2);
		height: calc(180rpx + constant(safe-area-inset-bottom));
	}

	.tn-footerfixed {
		position: fixed;
		width: 100%;
		bottom: calc(35rpx + env(safe-area-inset-bottom));
		z-index: 1024;
		box-shadow: 0 1rpx 6rpx rgba(0, 0, 0, 0);

	}

	/* 底部悬浮按钮 end*/

	/deep/.input-placeholder {
		font-size: 32rpx;
		color: #AAAAAA;
	}
</style>