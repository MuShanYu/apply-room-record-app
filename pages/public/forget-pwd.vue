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
					App密码找回
				</view>
				<view class="tn-margin tn-color-gray--dark tn-text-sm">
					tip:如未绑定邮箱请联系客服重置密码。
				</view>

				<!-- 输入框内容-->
				<view class="login__info tn-flex tn-flex-direction-column tn-flex-col-center tn-flex-row-center">
					<!-- 注册 -->
					<block>
						<view
							class="login__info__item__input tn-flex tn-flex-direction-row tn-flex-nowrap tn-flex-col-center tn-flex-row-left">
							<view class="login__info__item__input__left-icon">
								<view class="tn-icon-identity"></view>
							</view>
							<view class="login__info__item__input__content">
								<input v-model="form.stuNum" maxlength="16" placeholder-class="input-placeholder"
									placeholder="请输入用于登录的学号/工号" />
							</view>
						</view>

						<view
							class="login__info__item__input tn-flex tn-flex-direction-row tn-flex-nowrap tn-flex-col-center tn-flex-row-left">
							<view class="login__info__item__input__left-icon">
								<view class="tn-icon-safe"></view>
							</view>
							<view class="login__info__item__input__content login__info__item__input__content--verify-code">
								<input v-model="form.code" maxlength="4" placeholder-class="input-placeholder" placeholder="请输入验证码" />
							</view>
							<view class="login__info__item__input__right-verify-code">
								<tn-button @click="getCode" backgroundColor="#3668FC" fontColor="#FFFFFF" size="sm" padding="5rpx 10rpx"
									width="100%" shape="round">{{ codeTips }}</tn-button>
							</view>
						</view>

						<view
							class="login__info__item__input tn-flex tn-flex-direction-row tn-flex-nowrap tn-flex-col-center tn-flex-row-left">
							<view class="login__info__item__input__left-icon">
								<view class="tn-icon-lock"></view>
							</view>
							<view class="login__info__item__input__content">
								<input v-model="form.pwd" maxlength="32" :password="!showPassword" placeholder-class="input-placeholder"
									placeholder="请输入新密码" />
							</view>
							<view class="login__info__item__input__right-icon" @click="showPassword = !showPassword">
								<view :class="[showPassword ? 'tn-icon-eye' : 'tn-icon-eye-hide']"></view>
							</view>
						</view>
					</block>

					<view
						class="login__info__item__input tn-flex tn-flex-direction-row tn-flex-nowrap tn-flex-col-center tn-flex-row-left">
						<view class="login__info__item__input__left-icon">
							<view class="tn-icon-lock"></view>
						</view>
						<view class="login__info__item__input__content">
							<input v-model="form.newPwd" maxlength="32" :password="!showPassword"
								placeholder-class="input-placeholder" placeholder="请确认新密码" />
						</view>
						<view class="login__info__item__input__right-icon" @click="showPassword = !showPassword">
							<view :class="[showPassword ? 'tn-icon-eye' : 'tn-icon-eye-hide']"></view>
						</view>
					</view>
					</block>


					<!-- 悬浮按钮-->
					<view class="tn-margin-top-lg" style="width: 100%;position: relative;">
						<view class="tn-margin-top-lg">
							<tn-button backgroundColor="#3668FC" padding="40rpx 0" width="100%" :fontSize="28" fontColor="#FFFFFF"
								@click="handleRestPwd">
								<text class="">修 改 密 码</text>
							</tn-button>
						</view>
					</view>

					<view class="login__info__item__tips">
						<view class="tn-flex tn-flex-row-between">
							<button class="tn-button--clear-style" open-type="contact">
								<view class="tn-padding-right tn-color-red">联系客服申请重置密码</view>
							</button>
							<view class="tn-padding-left-lg tn-color-gray" @tap="goBack()">返回登录</view>
						</view>
					</view>

				</view>

			</view>

		</view>

		<!-- 验证码倒计时 -->
		<tn-verification-code :keepRunning='true' uniqueKey='forgetPwdCode' countDownText='s秒' ref="code" :seconds="60" @change="codeChange"></tn-verification-code>
		
		<tn-modal :showCloseBtn="true" @click="showFalseModal = false" v-model="showFalseModal" :title="'系统提示'"
			:content="message" :button="falseModalButton">
		</tn-modal>
		<tn-toast ref="toast"></tn-toast>

		<w-loading text="拼命处理中..." mask="true" click="true" ref="loading"></w-loading>
	</view>
</template>

<script>
	import {
		getVerifyCode,
		updatePwd
	} from '@/api/user.js'
	export default {
		name: 'forget-pwd',
		data() {
			return {
				// 是否显示密码
				showPassword: false,
				codeTips: '获取验证码',
				form: {
					stuNum: '',
					code: '',
					pwd: '',
					newPwd: ''
				},
				message: '',
				showFalseModal: false,
				falseModalButton: [{
					text: '我知道了',
					backgroundColor: '#3668FC',
					fontColor: '#FFFFFF',
				}],
				mail: ''
			}
		},
		methods: {
			// 跳转
			tn(url) {
				this.$Router.push(url)
			},
			// 获取验证码
			getCode() {
				if (this.form.stuNum.length == '') {
					this.$tn.message.toast('请输入学号/工号')
					return
				}
				if (this.$refs.code.canGetCode) {
					this.$refs.loading.open()
					getVerifyCode(this.form.stuNum).then(() => {
						this.$refs.loading.close()
						this.$tn.message.toast('验证码已经发送至您绑定的邮箱')
						// 通知组件开始计时
						this.$refs.code.start()
					}).catch(e => {
						// 不一定存在success，所以进行Boolean判断
						if (e.success == false) {
							this.message = e.message + '。' + '1.如果已经注册,但未绑定过邮箱或忘记绑定邮箱,请点击下方联系客服申请重置密码。2.未注册请注册。'
							this.showFalseModal = true
						}
						this.$refs.loading.close()
					})
				} else {
					this.$tn.message.toast(this.$refs.code.secNum + '秒后再重试')
				}
			},
			codeChange(text) {
				this.codeTips = text
			},
			handleRestPwd() {
				let that = this
				if (!this.verifyInfo()) {
					return
				}
				this.$refs.loading.open()
				let updatePwdDTO = {
					stuNum: that.form.stuNum,
					code: that.form.code,
					pwd: that.form.newPwd
				}
				updatePwd(updatePwdDTO).then(res => {
					this.$refs.loading.close()
					this.$refs.toast.show({
						title: '密码修改成功',
						duration: 1500
					})
					setTimeout(() => {
						this.goBack()
					}, 1500)
				}).catch(e => {
					// 不一定存在success，所以进行Boolean判断
					this.$refs.loading.close()
					if (e.success == false) {
						this.message = e.message
						this.showFalseModal = true
					}
				})
			},
			verifyInfo() {
				if (this.form.stuNum === '') {
					this.$refs.toast.show({
						title: '请输入学号',
						duration: 1000
					})
					return false
				}
				if (this.form.code.length !== 4) {
					this.$refs.toast.show({
						title: '验证码长度为4位',
						duration: 1000
					})
					return false
				}
				if (this.form.pwd.length < 6) {
					this.$refs.toast.show({
						title: '新密码长度不低于6位',
						duration: 1000
					})
					return false
				}
				if (this.form.newPwd.length < 6) {
					this.$refs.toast.show({
						title: '确认新密码长度不低于6位',
						duration: 1000
					})
					return false
				}
				if (this.form.pwd !== this.form.newPwd) {
					this.$refs.toast.show({
						title: '两次输入的密码不一致',
						duration: 1000
					})
					return false
				}
				return true
			}
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
					background-image: url(https://tnuiimage.tnkjapp.com/cool_bg_image/icon_bg.png);


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
		bottom: calc(30rpx + env(safe-area-inset-bottom));
		z-index: 1024;
		box-shadow: 0 1rpx 6rpx rgba(0, 0, 0, 0);

	}

	/* 底部悬浮按钮 end*/

	/deep/.input-placeholder {
		font-size: 32rpx;
		color: #AAAAAA;
	}
</style>