<template>
	<view>
		<tn-nav-bar fixed customBack backgroundColor="#FFFFFF" :bottomShadow="false">
			<view slot="back" class='tn-custom-nav-bar__back' @click="goBack">
				<text class='icon tn-icon-left'></text>
			</view>
			<view slot="default" class="">
				预约审批驳回
			</view>
		</tn-nav-bar>

		<view class="tn-padding tn-bg-white" :style="{marginTop: vuex_custom_bar_height + 'px'}">
			<view class="">
				<tn-input placeholderStyle="color: #AAAAAA;font-size:26rpx;" v-model="reason" type='textarea'
					placeholder='请输入操作备注' :maxLength="128" :border="true" :height="150" />
			</view>

			<view class="tn-margin-top tn-flex tn-flex-row-between">
				<view class="tn-flex-basic-xs">
					<tn-button :disabled="disabled" @click="handleRejectClick" :shadow="true" width="100%" :fontSize="26"
						:backgroundColor="disabled ? '#E6E6E6' : '#e54d42'" fontColor="#FFFFFF" margin="10rpx 0">驳回</tn-button>
				</view>
				<view class="tn-flex-basic-xs">
					<tn-button :disabled="disabled" @click="handleConfirmClick" :shadow="true" width="100%" :fontSize="26"
						:backgroundColor="disabled ? '#E6E6E6' : '#39b54a'" fontColor="#FFFFFF" margin="10rpx 0">通过</tn-button>
				</view>
			</view>

		</view>

		<!-- 悬浮按钮-->
		<view class="">
			<view @click="showSelect = true"
				class="icon15__item--icon tn-flex tn-flex-row-center tn-flex-col-center tn-shadow-blur button-1">
				<view class="tn-icon-write tn-color-white"></view>
			</view>
		</view>

		<w-loading text="拼命处理中..." mask="true" click="true" ref="loading"></w-loading>
		<tn-toast @closed="" ref="toast"></tn-toast>

		<tn-modal :showCloseBtn="true" @click="handleCancel" v-model="showRejectModal" :title="'提示'"
			:content="'您确认要驳回该房间预约申请吗'" :button="button"></tn-modal>

		<tn-modal :showCloseBtn="true" @click="handleConfirm" v-model="showConfirmModal" :title="'提示'"
			:content="'您确认要通过该房间预约申请吗'" :button="button"></tn-modal>

		<tn-modal :showCloseBtn="true" @click="showServiceErrorModal = false" v-model="showServiceErrorModal"
			:title="'系统提示'" :content="message" :button="serviceErrorModalButton">
		</tn-modal>

		<tn-select title="选择快捷键入语" confirmColor="#3668FC" v-model="showSelect" mode="single" :list="phrases"
			@confirm="handleSelectConfirm" :searchShow="false"></tn-select>
	</view>
</template>

<script>
	import {
		passOrRejectReserveApi
	} from '@/api/room.js'
	import {
		querySysConfigByKeyApi
	} from '@/api/config.js'
	export default {
		data() {
			return {
				reserveId: '',
				reason: '',
				showServiceErrorModal: false,
				message: '',
				serviceErrorModalButton: [{
					text: '我知道了',
					backgroundColor: '#3668FC',
					fontColor: '#FFFFFF',
				}],
				showRejectModal: false,
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
				disabled: false,
				showConfirmModal: false,
				phrases: [],
				showSelect: false,
			}
		},
		onLoad(param) {
			this.reserveId = param.reserveId
			querySysConfigByKeyApi('commonPhrases').then(res => {
				let commonPhrases = JSON.parse(res.configValue).phrases
				commonPhrases.forEach(item => {
					let obj = {
						value: item,
						label: item
					}
					this.phrases.push(obj)
				})
			})
			// console.log(this.reserveId);
		},
		methods: {
			handleRejectClick() {
				if (this.reason === '') {
					this.$refs.toast.show({
						title: '请填写操作备注',
						duration: 2000
					})
					return
				}
				this.showRejectModal = true
			},
			handleConfirmClick(item, index, pass) {
				if (this.reason === '') {
					this.$refs.toast.show({
						title: '请填写操作备注',
						duration: 2000
					})
					return
				}
				this.showConfirmModal = true
			},
			handleConfirm(e) {
				let that = this
				this.showConfirmModal = false
				if (e.index === 1) {
					// confirm
					this.$refs.loading.open()
					passOrRejectReserveApi(this.reserveId, true, this.reason).then(res => {
						this.$refs.loading.close()
						this.$refs.toast.show({
							title: '操作成功',
							duration: 1500
						})
						this.disabled = true
						uni.$emit('reserveOperated', {
							reserveId: this.reserveId
						})
					}).catch(e => {
						this.$refs.loading.close()
						this.handleError(e)
					})
				}
			},
			handleCancel(e) {
				this.showRejectModal = false
				if (e.index === 1) {
					this.$refs.loading.open()
					passOrRejectReserveApi(this.reserveId, false, this.reason).then(res => {
						this.$refs.loading.close()
						this.$refs.toast.show({
							title: '操作成功',
							duration: 1500
						})
						this.disabled = true
						uni.$emit('reserveOperated', {
							reserveId: this.reserveId
						})
					}).catch(e => {
						this.$refs.loading.close()
						this.handleError(e)
					})
				}
			},
			handleSelectConfirm(e) {
				this.reason = e[0].value
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

	/* 按钮 */
	.button-1 {
		background-color: rgba(0, 0, 0, 0.3);
		position: fixed;
		/* bottom:200rpx;
	    right: 20rpx; */
		bottom: 15%;
		right: 30rpx;
		z-index: 1001;
		border-radius: 100px;
	}

	/* 图标容器15 start */
	.icon15 {
		&__item {
			width: 30%;

			border-radius: 10rpx;
			padding: 30rpx;
			margin: 20rpx 10rpx;
			transform: scale(1);
			transition: transform 0.3s linear;
			transform-origin: center center;

			&--icon {
				width: 100rpx;
				height: 100rpx;
				font-size: 50rpx;
				border-radius: 50%;
				margin-bottom: 18rpx;
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
</style>