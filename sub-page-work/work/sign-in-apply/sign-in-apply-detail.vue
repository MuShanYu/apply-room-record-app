<template>
	<view>
		<tn-nav-bar fixed customBack backgroundColor="#FFFFFF" :bottomShadow="false">
			<view slot="back" class='tn-custom-nav-bar__back' @click="goBack">
				<text class='icon tn-icon-left'></text>
			</view>
			<view slot="default" class="">
				申请
			</view>
		</tn-nav-bar>
		<view class="" :style="{marginTop: vuex_custom_bar_height + 'px'}">
			<view class="tn-padding tn-bg-white">
				<view class="">
					<view class="tn-text-bold tn-text-md tn-text-ellipsis">
						{{roomName}}补卡申请
					</view>
					<view class="tn-color-gray tn-margin-top-sm" style="font-size: 26rpx;">
						<view class="">
							签到时间：{{entryTime | dateFormat}}
						</view>
					</view>
				</view>
				<view class="tn-margin-top">
					<tn-input placeholderStyle="color: #AAAAAA;font-size:26rpx;" :selectOpen="showTimePicker"
						placeholder='请选择您的签退时间' v-model="time" type="select" :border="true" @click="showTimePicker = true" />
				</view>
				<view class="tn-margin-top">
					<tn-input placeholderStyle="color: #AAAAAA;font-size:26rpx;" v-model="application.reason" type='textarea'
						placeholder='请输入申请理由，用于审核' :maxLength="128" :border="true" :height="150" />
				</view>
				<view class="tn-margin-top tn-text-right">
					<tn-button :fontSize="26" :disabled="disabled" @click="handleSubmitClick" width="100%"
						:backgroundColor="disabled ? '#E6E6E6' : '#3668FC'" :shadow="true" fontColor="#FFFFFF">确 认 申 请
					</tn-button>
				</view>
			</view>
		</view>

		<view class="tn-margin-top tn-bg-white tn-padding-sm">
			<view class="tn-flex tn-flex-col-center tn-flex-row-between">
				<view class="">
					<text class="tn-text-sm tn-color-gray">点击订阅申请审批结果通知</text>
				</view>
				<view class="">
					<tn-button @click="subscribe" class="tn-margin-left" size="sm" :shadow="false" backgroundColor="#39b54a"
						fontColor="#FFFFFF">订阅
					</tn-button>
				</view>
			</view>
		</view>


		<w-loading text="拼命处理中..." mask="true" click="true" ref="loading"></w-loading>
		<tn-toast ref="toast"></tn-toast>

		<tn-picker title="请选择签退时间" mode="time" :cancelText="'清除'" :defaultTime="defaultStartTime" v-model="showTimePicker"
			:params="params" :showTimeTag="true" @cancel="handleCancel" @confirm="handleTimeConfrim"></tn-picker>

		<tn-modal :showCloseBtn="true" @click="handleConfirm" v-model="showConfirmModal" :title="'提示'"
			:content="'确认要提交该申请吗?'" :button="button"></tn-modal>

		<tn-modal :showCloseBtn="true" @click="showServiceErrorModal = false" v-model="showServiceErrorModal"
			:title="'系统提示'" :content="message" :button="serviceErrorModalButton">
		</tn-modal>
	</view>
</template>

<script>
	import {
		saveApplicationApi
	} from '@/api/application.js'
	import {
		dateShow
	} from '@/utils/index.js'
	export default {
		data() {
			return {
				params: {
					year: true,
					month: true,
					day: true,
					hour: true,
					minute: true,
					timestamp: true
				},
				entryTime: 0,
				roomName: '',
				startTime: 0,
				endTime: 0,
				accessRecordId: '',
				disabled: false,
				application: {
					title: '',
					reason: '',
					applicationType: 0,
					// 房间进出记录ID
					matterRecordId: '',
					handleUserId: ''
				},
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
				showTimePicker: false,
				time: '',
				// 默认显示的时间戳，computed计算后转换为字符串
				timestamp: 0,
				showServiceErrorModal: false,
				message: '',
				serviceErrorModalButton: [{
					text: '我知道了',
					backgroundColor: '#3668FC',
					fontColor: '#FFFFFF',
				}],
				tmplIds: ['KDq-tcXy2GiJAE37geDtN5Ta-G5wJ2szj0U_4dgHSro'],
			}
		},
		onLoad(params) {
			// console.log(params);
			this.accessRecordId = params.accessRecordId
			this.application.matterRecordId = params.accessRecordId
			this.entryTime = Number(params.entryTime)
			this.roomName = params.roomName
			this.application.handleUserId = params.chargePersonId
			// 创建一个 Date 对象
			let date = new Date(Number(this.entryTime));
			// 设置时间为 00:00:00
			date.setHours(0, 0, 0, 0);
			// 获取当天开始时间的时间戳
			this.startTime = date.getTime();
			// 设置时间为 23:59:59
			this.endTime = this.startTime + 24 * 60 * 60 * 1000 - 1;
			this.timestamp = Number(this.entryTime)
		},
		filters: {
			dateFormat(date) {
				return dateShow(date, 'yyyy年MM月dd日 hh:mm')
			},
		},
		computed: {
			defaultStartTime() {
				return dateShow(this.timestamp, 'yyyy-MM-dd hh:mm')
			}
		},
		methods: {
			handleSubmitClick() {
				if (this.application.reason === '') {
					this.$refs.toast.show({
						title: '请输入申请理由',
						duration: 1500
					})
					return
				}
				this.showConfirmModal = true
			},
			handleConfirm(e) {
				this.showConfirmModal = false
				if (e.index === 1) {
					let that = this
					if (this.time === '') {
						this.$refs.toast.show({
							title: '签退时间未选择',
							duration: 1500
						})
						return
					}
					if (this.application.reason === '') {
						this.$refs.toast.show({
							title: '申请理由未填写',
							duration: 1500
						})
						return
					}
					// 构建保存对象
					this.application.title = uni.getStorageSync('userInfo').name + '的' + this.roomName + '补卡申请'
					let obj = {
						reason: this.application.reason,
						outTime: this.timestamp
					}
					let dto = Object.assign({}, this.application)
					dto.reason = JSON.stringify(obj)
					this.$refs.loading.open()
					saveApplicationApi(dto).then(res => {
						this.$refs.loading.close()
						this.$refs.toast.show({
							title: '申请成功',
							duration: 1500
						})
						this.disabled = true
						uni.$emit('signInApply', {
							accessRecordId: that.accessRecordId
						})
					}).catch(e => {
						console.log(e);
						this.disabled = true
						this.$refs.loading.close()
						this.handleError(e)
					})
				}
			},
			handleTimeConfrim(e) {
				// 校验
				if (this.entryTime >= e.timestamp * 1000) {
					this.$refs.toast.show({
						title: '所选择的时间不能小于您已记录的进入时间',
						duration: 3000
					})
					return
				}
				if (e.timestamp * 1000 >= this.endTime) {
					this.$refs.toast.show({
						title: '时间选择必须在签到当天',
						duration: 3000
					})
					return
				}
				// 更改默认展示时间，computed属性自动计算变更
				this.timestamp = e.timestamp * 1000 //毫秒
				this.time = e.year + '年' + e.month + '月' + e.day + '日 ' + e.hour + ':' + e.minute
			},
			handleCancel(e) {
				this.time = ''
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