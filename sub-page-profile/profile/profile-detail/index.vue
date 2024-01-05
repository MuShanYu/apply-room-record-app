<template>
	<view class="tn-safe-area-inset-bottom">
		<tn-nav-bar fixed customBack backgroundColor="#FFFFFF" :bottomShadow="false">
			<view slot="back" class='tn-custom-nav-bar__back' @click="goBack">
				<text class='icon tn-icon-left'></text>
			</view>
			<view slot="default" class="">
				个人信息
			</view>
		</tn-nav-bar>

		<view class="" :style="{marginTop: vuex_custom_bar_height + 'px'}">

			<view class="tn-flex tn-flex-col-center tn-flex-row-between tn-bg-white tn-padding">
				<view class="">
					<view class="tn-text-bold tn-text-lg">
						{{userInfo.name}}
					</view>
					<view class="tn-color-gray tn-margin-top-xs">
						{{role}}
					</view>
				</view>
				<view class="tn-text-lg tn-color-grey">
					<view class="logo-pic">
						<view class="logo-image">
							<view class="tn-shadow-blur" :style="{backgroundImage: 'url(' + headerImage + ');'}"
								style="width: 80rpx;height: 80rpx;background-size: cover;overflow: hidden;">
							</view>
						</view>
					</view>
				</view>
			</view>

			<view class="tn-flex tn-flex-row-between tn-padding tn-margin-top-sm tn-bg-white"
				@click="showAuthorizationModal = true">
				<view class="justify-content-item">
					<view class="tn-text-bold tn-text-lg">
						{{isBindWx ? '解除微信绑定' : '绑定微信'}}
					</view>
					<view class="tn-color-gray tn-padding-top-xs">
						{{isBindWx ? '微信已绑定' : '微信未绑定'}}
					</view>
				</view>
				<view class="justify-content-item tn-text-lg tn-color-grey">
					<view class="tn-icon-right tn-padding-top"></view>
				</view>
			</view>

			<view class="tn-flex tn-flex-row-between tn-padding tn-bg-white" @click="showPicker = true">
				<view class="justify-content-item">
					<view class="tn-text-bold tn-text-lg">
						学院
					</view>
					<view class="tn-color-gray tn-padding-top-xs">
						{{userInfo.institute}}
					</view>
				</view>
				<view class="justify-content-item tn-text-lg tn-color-grey">
					<view class="tn-icon-right tn-padding-top"></view>
				</view>
			</view>

			<view class="tn-flex tn-flex-row-between tn-padding tn-bg-white" @click="handleClickStuNum">
				<view class="justify-content-item">
					<view class="tn-text-bold tn-text-lg">
						学号
					</view>
					<view class="tn-color-gray tn-padding-top-xs">
						{{userInfo.stuNum}}
					</view>
				</view>
				<view class="justify-content-item tn-text-lg tn-color-grey">
					<view class="tn-icon-right tn-padding-top"></view>
				</view>
			</view>

			<view class="tn-flex tn-flex-row-between tn-padding tn-bg-white" @click="handleUpdateClick(0)">
				<view class="justify-content-item">
					<view class="tn-text-bold tn-text-lg">
						姓名
					</view>
					<view class="tn-color-gray tn-padding-top-xs">
						{{userInfo.name}}
					</view>
				</view>
				<view class="justify-content-item tn-text-lg tn-color-grey">
					<view class="tn-icon-right tn-padding-top"></view>
				</view>
			</view>

			<view class="tn-flex tn-flex-row-between tn-padding tn-bg-white" @click="handleUpdateClick(1)">
				<view class="justify-content-item">
					<view class="tn-text-bold tn-text-lg">
						邮箱
					</view>
					<view class="tn-color-gray tn-padding-top-xs">
						{{userInfo.mail}}
					</view>
				</view>
				<view class="justify-content-item tn-text-lg tn-color-grey">
					<view class="tn-icon-right tn-padding-top"></view>
				</view>
			</view>

			<view class="tn-padding">
				<tn-button shape="round" width="100%" backgroundColor="#e54d42" :shadow="true"
					fontColor="#FFFFFF">退出登录</tn-button>
			</view>
		</view>

		<w-loading text="拼命处理中..." mask="true" click="true" ref="loading"></w-loading>

		<tn-toast ref="toast"></tn-toast>

		<tn-modal @click="handleAuthorization" :radius='40' v-model="showAuthorizationModal" :title="'提示'"
			:content="'授权系统获取您的用户标识ID，方便您使用微信快捷登录App。'" :button="button"></tn-modal>

		<tn-picker @confirm='pickerConfirm' mode="selector" v-model="showPicker" :defaultSelector="[0]"
			:range="institutes"></tn-picker>

		<tn-modal v-model="showUpdateModal" :custom="true" :showCloseBtn="false" :radius='40'>
			<view class="">
				<view class="">
					<view class="tn-text-lg tn-text-bold tn-text-center tn-padding">
						{{updateName ? '修改姓名' : '修改邮箱'}}
					</view>
					<view class="tn-bg-gray--light">
						<tn-input :placeholder="updateName ? '请输入更改后的姓名' : '请输入更改后的邮箱'" type="text"
							placeholderStyle="color:#AAAAAA" maxlength="36"></tn-input>
					</view>
				</view>
				<view class="tn-flex tn-flex-row-between tn-margin-top">
					<view class="">
						<tn-button @click="showUpdateModal = false" backgroundColor="tn-bg-gray" fontBold>
							<text class="tn-color-white">取 消</text>
						</tn-button>
					</view>
					<view class="">
						<tn-button backgroundColor="#3668FC" fontBold>
							<text class="tn-color-white">保 存</text>
						</tn-button>
					</view>
				</view>
			</view>
		</tn-modal>

	</view>
</template>

<script>
	import {
		querySysConfigByKeyApi
	} from '@/api/config.js'
	export default {
		data() {
			return {
				headerImage: '',
				userInfo: '',
				role: '',
				isBindWx: false,
				showAuthorizationModal: false,
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
				showPicker: false,
				institutes: [],
				updateName: false,
				showUpdateModal: false
			}
		},
		onLoad(params) {
			this.headerImage = params.headerImage
			this.userInfo = uni.getStorageSync('userInfo')
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
			this.isBindWx = uni.getStorageSync('isBindWx') || false
			this.userInfo.mail = this.userInfo.mail.replace(/(.{0,3}).*@(.*)/, "$1***@$2")
			querySysConfigByKeyApi('institutes').then(res => {
				let configValue = JSON.parse(res.configValue)
				this.institutes = configValue.institutes
			})
		},
		methods: {
			handleAuthorization(e) {
				this.showAuthorizationModal = false
				if (e.index === 1) {
					// 授权
				}
			},
			pickerConfirm(e) {

			},
			handleClickStuNum() {
				this.$refs.toast.show({
					title: '不允许修改学号',
					duration: 1500
				})
			},
			handleUpdateClick(e) {
				if (e === 0) {
					// 修改姓名
					this.updateName = true
				} else if (e === 1) {
					// 修改邮箱
					this.updateName = false
				}
				this.showUpdateModal = true
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
		width: 80rpx;
		height: 80rpx;
		position: relative;
		overflow: hidden;
		border-radius: 50%;
	}


	/* 底部悬浮按钮 start*/
	.tn-tabbar-height {
		min-height: 100rpx;
		height: calc(120rpx + env(safe-area-inset-bottom) / 2);
	}

	.tn-footerfixed {
		position: fixed;
		width: 100%;
		bottom: calc(30rpx + env(safe-area-inset-bottom));
		z-index: 1024;
		box-shadow: 0 1rpx 6rpx rgba(0, 0, 0, 0);

	}

	/* 底部悬浮按钮 end*/
</style>