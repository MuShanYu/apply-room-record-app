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
				<tn-input v-model="rejectReason" type='textarea' placeholder='请输入驳回原因' :maxLength="128" :border="true"
					:height="150" />
			</view>

			<view class="tn-margin-top tn-text-right">
				<tn-button @click="handleSubmitClick" :disabled="disabled" :backgroundColor="disabled ? '#E6E6E6' : '#39b54a'"
					class="" :shadow="false" fontColor="#FFFFFF"> 确 认
				</tn-button>
			</view>

		</view>

		<w-loading text="拼命处理中..." mask="true" click="true" ref="loading"></w-loading>
		<tn-toast @closed="" ref="toast"></tn-toast>

		<tn-modal @click="handleConfirm" :radius='40' v-model="showConfirmModal" :title="'提示'" :content="'您确认要驳回该房间预约申请吗'"
			:button="button"></tn-modal>

		<tn-modal @click="showServiceErrorModal = false" :radius='40' v-model="showServiceErrorModal" :title="'系统提示'"
			:content="message" :button="serviceErrorModalButton">
		</tn-modal>
	</view>
</template>

<script>
	import {
		passOrRejectReserveApi
	} from '@/api/room.js'

	export default {
		data() {
			return {
				reserveId: '',
				rejectReason: '',
				showServiceErrorModal: false,
				message: '',
				serviceErrorModalButton: [{
					text: '我知道了',
					backgroundColor: '#3668FC',
					fontColor: '#FFFFFF',
				}],
				showConfirmModal: false,
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
				disabled: false
			}
		},
		onLoad(param) {
			this.reserveId = param.reserveId
			// console.log(this.reserveId);
		},
		methods: {
			handleSubmitClick() {
				if (this.rejectReason === '') {
					this.$refs.toast.show({
						title: '请填写驳回原因',
						duration: 2000
					})
					return
				}
				this.showConfirmModal = true
			},
			handleConfirm(e) {
				this.showConfirmModal = false
				if (e.index === 1) {
					this.$refs.loading.open()
					passOrRejectReserveApi(this.reserveId, false, this.rejectReason).then(res => {
						this.$refs.loading.close()
						this.$refs.toast.show({
							title: '操作成功',
							duration: 1500
						})
						this.disabled = true
						uni.$emit('reserveRejected', {
							reserveId: this.reserveId
						})
					}).catch(e => {
						this.$refs.loading.close()
						this.handleError(e)
					})
				}
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
</style>