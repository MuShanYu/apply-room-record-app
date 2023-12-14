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

		<view class="tn-bg-white tn-padding" :style="{marginTop: vuex_custom_bar_height + 'px'}">
			<view class="tn-text-lg tn-text-bold tn-margin-bottom-xs">
				{{roomName}}
			</view>
			<view class="tn-margin-bottom tn-color-gray">
				{{equipmentInfo}}
			</view>
			<view class="tn-color-gray">
				<view class="tn-margin-bottom-sm">
					负责人：{{name}}
				</view>
				<view class="tn-margin-bottom-sm">
					预约开始时间：{{startTimeStr}}
				</view>
				<view class="tn-margin-bottom-sm">
					预约结束时间：{{endTimeStr}}
				</view>
			</view>
			<view class="tn-margin-bottom">
				<tn-input :maxLength="500" placeholder="请输入预约理由" v-model="applyRoomDTO.roomUsage" type="textarea" :border="true"
					:height="150" :autoHeight="true" />
			</view>
			<view class="">
				<tn-button @click="handleSubmitClick" :shadow="true" width="100%" backgroundColor="#3668FC" fontColor="#FFFFFF"
					margin="10rpx 0">确 认 预 约</tn-button>
			</view>
		</view>
		<view v-if="!isSubscribed" class="tn-margin-top tn-bg-white tn-padding-sm">
			<view class="tn-flex tn-flex-col-center tn-flex-row-center">
				<view class="">
					<text class="tn-text-sm tn-color-gray">订阅审核提醒、处理结果提醒、撤销提醒。</text>
				</view>
				<view class="">
					<tn-button @click="subscribe" class="tn-margin-left" size="sm" :shadow="true" backgroundColor="#01BEFF"
						fontColor="#FFFFFF">订
						阅</tn-button>
				</view>
			</view>
		</view>
		<tn-toast ref="toast"></tn-toast>

		<tn-modal @click="submit" :radius='40' v-model="showModal" :title="'提示'" :content="'您确认要预约该房间吗？'"
			:button="button"></tn-modal>

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
				tmplIds: ['Y12YmCT2wYbtSI38JGcuOqTjlqoyUOuWMaoqc_X4slU', 'baXQdlZqZoYowKZEmVpocG1_4LTZZ1Ar_rRzlD2CJuU',
					'VmPW-Qbm9nVfGU5mvSunjjW9ekd518mY029zd812xnA'
				],
				isSubscribed: true
			}
		},
		onLoad(param) {
			this.applyRoomDTO.roomId = param.id
			this.applyRoomDTO.startTime = Number(param.startTime)
			this.applyRoomDTO.endTime = Number(param.endTime)
			this.roomName = param.roomName
			this.equipmentInfo = param.equipmentInfo
			this.name = param.name
			this.startTimeStr = dateShow(Number(param.startTime))
			this.endTimeStr = dateShow(Number(param.endTime))
			let that = this
			wx.getSetting({
				withSubscriptions: true,
				success(res) {
					console.log(res);
					console.log(res.subscriptionsSetting);
					that.tmplIds.forEach(item => {
						if (res.subscriptionsSetting.itemSettings[item] !== 'accept') {
							that.isSubscribed = false
						}
					})
				}
			})
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
			},
			submit(e) {
				if (e.index === 1) {
					// 提交
					console.log('submit');
				}
				this.showModal = false
			},
			subscribe() {
				let that = this
				wx.requestSubscribeMessage({
					tmplIds: that.tmplIds,
					success(res) {
						that.tmplIds.forEach(item => {
							if (res[item] === 'accept') {
								// 用户同意订阅这一条消息
							}
						})
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
</style>