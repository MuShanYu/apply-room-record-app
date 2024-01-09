<template>
	<view>
		<tn-nav-bar fixed customBack backgroundColor="#FFFFFF" :bottomShadow="false">
			<view slot="back" class='tn-custom-nav-bar__back' @click="goBack">
				<text class='icon tn-icon-left'></text>
			</view>
			<view slot="default" class="tn-text-ellipsis">
				{{roomName}}
			</view>
		</tn-nav-bar>
		<view class="tn-padding tn-bg-white" :style="{marginTop: vuex_custom_bar_height + 'px'}">
			<view class="">
				<tn-input v-model="reason" type='textarea' placeholder='请输入取消预约原因' :maxLength="128" :border="true"
					:height="150" />
			</view>

			<view class="tn-margin-top tn-flex tn-flex-row-between">
				<tn-button @click="goBack" backgroundColor="tn-bg-gray'" class="" :shadow="false" fontColor="#FFFFFF"> 取 消
				</tn-button>
				<tn-button @click="handleCancelClick" :disabled="disabled" :backgroundColor="disabled ? '#E6E6E6' : '#3668FC'"
					class="" :shadow="false" fontColor="#FFFFFF"> 确 认
				</tn-button>
			</view>

		</view>

		<tn-modal :showCloseBtn="true" @click="handleCancel" v-model="showCancelModal" :title="'系统提示'"
			content="确认要取消该房间预约申请吗?" :button="button">
		</tn-modal>

		<tn-modal :showCloseBtn="true" @click="showServiceErrorModal = false" v-model="showServiceErrorModal"
			:title="'系统提示'" :content="message" :button="serviceErrorModalButton">
		</tn-modal>

		<tn-toast @closed="" ref="toast"></tn-toast>
		<w-loading text="拼命处理中..." mask="true" click="true" ref="loading"></w-loading>
	</view>
</template>

<script>
	import {
		cancelReserveRoomApi
	} from '@/api/room.js'
	export default {
		data() {
			return {
				reservationId: '',
				roomName: '',
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
				showCancelModal: false,
				reason: '',
				disabled: false,
				showServiceErrorModal: false,
				message: '',
				serviceErrorModalButton: [{
					text: '我知道了',
					backgroundColor: '#3668FC',
					fontColor: '#FFFFFF',
				}],
			}
		},
		onLoad(params) {
			console.log(params);
			this.reservationId = params.reservationId
			this.roomName = params.roomName
		},
		methods: {
			handleCancelClick() {
				if (this.reason === '') {
					this.$refs.toast.show({
						title: '请输入预约取消原因',
						duration: 2000
					})
					return
				}
				this.showCancelModal = true
			},
			handleCancel(e) {
				this.showCancelModal = false
				if (e.index === 1) {
					this.$refs.loading.open()
					cancelReserveRoomApi(this.reservationId, this.reason).then(() => {
						this.$refs.loading.close()
						this.disabled = true
						this.$refs.toast.show({
							title: '操作成功',
							duration: 1500
						})
						uni.$emit('roomCancel', {
							reservationId: this.reservationId
						})
					}).catch(e => {
						this.$refs.loading.close()
						this.handleError(e)
					})
				}
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
</style>