<template>
	<view>
		<tn-nav-bar fixed customBack backgroundColor="#FFFFFF" :bottomShadow="false">
			<view slot="back" class='tn-custom-nav-bar__back' @click="goBack">
				<text class='icon tn-icon-left'></text>
			</view>
			<view slot="default" class="">
				预约
			</view>
		</tn-nav-bar>

		<view class="tn-bg-white tn-padding " :style="{marginTop: vuex_custom_bar_height + 'px'}">
			<view class="tn-text-bold tn-margin-bottom-sm tn-text-md">
				{{roomName}}
			</view>
			<view class="tn-margin-bottom-sm text-content tn-text-bold">
				预约时间：{{startTimeStr}}~{{endTimeStr}}
			</view>
			<view class="tn-margin-bottom-sm tn-color-gray text-content">
				拥有{{equipmentInfo}}等。
			</view>
			<view class="tn-margin-bottom-sm tn-color-gray text-content">
				负责人：{{name}}
			</view>
			<view class="tn-margin-bottom">
				<tn-input placeholderStyle="color: #AAAAAA;font-size:26rpx;" :maxLength="500" placeholder="请输入预约理由"
					v-model="applyRoomDTO.roomUsage" type="textarea" :border="true" :height="150" :autoHeight="true" />
			</view>
			<view class="">
				<tn-button :disabled="!canApply" @click="handleSubmitClick" :shadow="true" width="100%" :fontSize="26"
					:backgroundColor="!canApply ? '#E6E6E6' : '#3668FC'" fontColor="#FFFFFF">确 认 预 约</tn-button>
			</view>
		</view>
		<view class="tn-margin-top tn-bg-white tn-padding-sm">
			<view class="tn-flex tn-flex-col-center tn-flex-row-between">
				<view class="">
					<text class="tn-text-sm tn-color-gray">点击订阅审核结果通知</text>
				</view>
				<view class="">
					<tn-button @click="subscribe" class="tn-margin-left" size="sm" :shadow="true" backgroundColor="#39b54a"
						fontColor="#FFFFFF">订阅
					</tn-button>
				</view>
			</view>
		</view>


		<tn-toast ref="toast"></tn-toast>
		<w-loading text="拼命处理中..." mask="true" click="true" ref="loading"></w-loading>
		<tn-modal :showCloseBtn="true" @click="submit" v-model="showModal" :title="'提示'" :content="'您确认要预约该房间吗？'"
			:button="button"></tn-modal>

		<tn-modal :showCloseBtn="true" @click="showServiceErrorModal = false" v-model="showServiceErrorModal"
			:title="'系统提示'" :content="message" :button="serviceErrorModalButton">
		</tn-modal>
	</view>
</template>

<script>
	import {
		reserveRoom
	} from '@/api/room.js'

	import {
		dateShow
	} from '@/utils/index.js'
	export default {
		data() {
			return {
				name: '',
				roomName: '',
				equipmentInfo: '',
				startTimeStr: '',
				endTimeStr: '',
				applyRoomDTO: {
					roomId: '',
					startTime: 0,
					endTime: 0,
					roomUsage: ''
				},
				showModal: false,
				button: [{
						text: '取消',
						backgroundColor: 'tn-bg-gray',
						fontColor: '#FFFFFF',
					},
					{
						text: '确定',
						backgroundColor: '#3668FC',
						fontColor: '#FFFFFF'
					}
				],
				tmplIds: ['48xKmWfwx9x13ErSEcaN-bDECReifFAUIQ1GV5AgSg8',
					'1S8cwxpW5OqEb_iUwZfk1NpO8rxcWJgFirAQWdYd-Ro'
				],
				isSubscribed: true,
				canApply: true,
				serviceErrorModalButton: [{
					text: '我知道了',
					backgroundColor: '#3668FC',
					fontColor: '#FFFFFF',
				}],
				showServiceErrorModal: false,
				message: '',
			}
		},
		onLoad(param) {
			this.applyRoomDTO.roomId = param.id
			this.applyRoomDTO.startTime = Number(param.startTime)
			this.applyRoomDTO.endTime = Number(param.endTime)
			this.roomName = param.roomName
			this.equipmentInfo = param.equipmentInfo
			this.name = param.name
			this.startTimeStr = dateShow(Number(param.startTime), "yyyy年MM月dd日 hh:mm")
			this.endTimeStr = dateShow(Number(param.endTime), 'hh:mm')
		},
		methods: {
			handleSubmitClick() {
				if (this.applyRoomDTO.roomUsage === '') {
					this.$refs.toast.show({
						title: '请填写预约理由',
						duration: 1500
					})
					return
				}
				this.showModal = true
			},
			submit(e) {
				this.showModal = false
				if (e.index === 1) {
					// 提交
					this.$refs.loading.open()
					reserveRoom(this.applyRoomDTO).then(res => {
						this.canApply = false
						this.$refs.loading.close()
						this.$refs.toast.show({
							title: '房间预约成功，已通知管理员进行审核',
							duration: 2000
						})
						uni.$emit('applyRoom', {
							roomId: this.applyRoomDTO.roomId
						})
					}).catch(e => {
						this.canApply = false
						this.$refs.loading.close()
						this.handleError(e)
					})
				}
			},
			subscribe() {
				let that = this
				wx.requestSubscribeMessage({
					tmplIds: that.tmplIds,
					success(res) {
						that.tmplIds.forEach(item => {
							if (res[item] === 'accept') {
								// 用户同意订阅这一条消息
								that.$refs.toast.show({
									title: '订阅成功'
								})
							}
						})
					},
					fail(e) {
						console.log("error: ", e);
					}
				})
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

	.text-content {
		font-size: 26rpx;
	}
</style>