<template>
	<view>
		<tn-nav-bar fixed customBack backgroundColor="#FFFFFF" :bottomShadow="false">
			<view slot="back" class='tn-custom-nav-bar__back' @click="goBack">
				<text class='icon tn-icon-left'></text>
			</view>
			<view slot="default" class="">
				账号安全
			</view>
		</tn-nav-bar>

		<view class="tn-padding-top-xs" :style="{marginTop: vuex_custom_bar_height + 'px'}">
			<view class="tn-bg-white">
				<tn-list-cell :unlined="true">
					<view class="tn-flex tn-flex-row-between tn-flex-col-center">
						<view class="tn-flex">
							<view class="tn-margin-right-xs">
								<tn-avatar size="30rpx"
									src="https://mushanyu-app-arr.oss-cn-beijing.aliyuncs.com/static/weixin.png"></tn-avatar>
							</view>
							<view class="tn-color-gray tn-text-sm">{{isBindWx ? '微信已绑定，可通过微信快捷登录' : '未绑定微信，不可通过微信快捷登录'}}</view>
						</view>
						<view class="tn-flex tn-flex-col-center">
							<tn-button @click="showAuthorizationModal = true" backgroundColor="#3668FC" fontColor="#FFFFFF"
								shape="round" size="sm">
								{{isBindWx ? '解除绑定' : '绑定'}}
							</tn-button>
						</view>
					</view>
				</tn-list-cell>
			</view>

		</view>

		<w-loading text="拼命处理中..." mask="true" click="true" ref="loading"></w-loading>

		<tn-toast ref="toast"></tn-toast>

		<tn-modal @click="handleAuthorization" v-model="showAuthorizationModal" :title="'提示'" :showCloseBtn="true"
			:content="isBindWx ? '确定要解除微信绑定吗?届时您将无法通过微信进行快捷登录。' : '授权系统获取您的用户标识ID，绑定微信后方便您使用微信快捷登录App。'"
			:button="button"></tn-modal>


	</view>
</template>

<script>
	import {
		wxBindApi,
		wxUnBindApi
	} from '@/api/user.js'
	export default {
		data() {
			return {
				isBindWx: false,
				button: [{
						text: '取消',
						backgroundColor: 'tn-bg-gray',
						fontColor: '#FFFFFF',
					},
					{
						text: '确认',
						backgroundColor: '#3668FC',
						fontColor: '#FFFFFF'
					}
				],
				showAuthorizationModal: false
			}
		},
		onLoad() {
			this.isBindWx = uni.getStorageSync('isBindWx')
		},
		methods: {
			handleAuthorization(e) {
				this.showAuthorizationModal = false
				if (e.index === 1) {
					// 授权
					if (this.isBindWx) {
						this.handleUnBindWx()
					} else {
						this.handleBindWx()
					}
				}
			},
			handleUnBindWx() {
				this.$refs.loading.open();
				let that = this
				uni.login({
					provider: 'weixin',
					scopes: '',
					success(res) {
						let code = res.code
						wxUnBindApi(code).then(() => {
							that.isBindWx = false
							uni.setStorageSync('isBindWx', false)
							that.$refs.loading.close()
							that.$refs.toast.show({
								title: '解除绑定成功',
								duration: 1500
							})
							uni.$emit('infoUpdate')
						}).catch(e => {
							that.$refs.loading.close()
							that.handleError(e)
						})
					},
					fail(e) {
						console.log(e);
						that.$refs.loading.close()
					}
				})
			},
			handleBindWx() {
				this.$refs.loading.open();
				let that = this
				uni.login({
					provider: 'weixin',
					scopes: '',
					success(res) {
						let code = res.code
						wxBindApi(code).then(() => {
							that.isBindWx = true
							uni.setStorageSync('isBindWx', true)
							that.$refs.loading.close()
							that.$refs.toast.show({
								title: '绑定成功',
								duration: 1500
							})
							uni.$emit('infoUpdate')
						}).catch(e => {
							that.$refs.loading.close()
							that.handleError(e)
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

	.list {
		&__left {
			display: flex;
			align-items: center;
			justify-content: flex-start;

			&__icon,
			&__image {
				margin-right: 18rpx;
			}
		}

		&__right {
			display: flex;
			align-items: center;
			justify-content: flex-end;
		}
	}

	.list-icon-text,
	.list-image-text {
		display: flex;
		align-items: center;
		justify-content: space-between;
	}
</style>