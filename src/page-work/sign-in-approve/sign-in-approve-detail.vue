<template>
	<view>
		<tn-nav-bar fixed customBack backgroundColor="#FFFFFF" :bottomShadow="false">
			<view slot="back" class='tn-custom-nav-bar__back' @click="goBack">
				<text class='icon tn-icon-left'></text>
			</view>
			<view slot="default" class="tn-text-ellipsis">
				{{dto.title}}
			</view>
		</tn-nav-bar>
		<view class="tn-bg-white tn-padding" :style="{marginTop: vuex_custom_bar_height + 'px'}">
			<view class="tn-flex tn-flex-row-between">
				<view class="tn-text-bold tn-text-md">
					{{room.roomName}}
				</view>
				<view class="tn-color-gray text-content">
					<text class="tn-icon-menu" style="padding-right: 6rpx;"></text> {{room.category}}
				</view>
			</view>
			<view class="tn-margin-top-sm text-content">
				<view class="tn-text-bold">
					申请补卡时间：{{dto.outTime | dateFormat}}
				</view>
				<view class="tn-color-gray tn-margin-top-sm">
					进入时间：{{record.entryTime | dateFormat}}
				</view>
			</view>
			<view class="tn-margin-top-sm tn-color-gray text-content">
				<view class="">
					申请原因：{{dto.reason}}
				</view>
			</view>
			<view class="tn-flex tn-flex-row-between tn-margin-top-sm tn-color-gray tn-text-sm">
				<view class="">
					<text class="tn-icon-identity" style="padding-right: 6rpx;"></text> {{dto.stuNum}}
				</view>
				<view class="">
					<text class="tn-icon-my" style="padding-right: 6rpx;"></text>
					{{dto.name}}
				</view>
			</view>
		</view>

		<view class="tn-margin-top tn-bg-white tn-padding">
			<view class="">
				<tn-input placeholderStyle="color: #AAAAAA;font-size:26rpx;" v-model="remark" type='textarea'
					placeholder='请输入申请处理备注' :maxLength="128" :border="true" :height="150" />
			</view>
			<view class="tn-margin-top tn-flex tn-flex-row-between">
				<view class="tn-flex-basic-xs">
					<tn-button :disabled="disabled" @click="handleRjectClick" :shadow="true" width="100%" :fontSize="26"
						:backgroundColor="disabled ? '#E6E6E6' : '#e54d42'" fontColor="#FFFFFF" margin="10rpx 0">驳回</tn-button>
				</view>
				<view class="tn-flex-basic-xs">
					<tn-button :disabled="disabled" @click="handleConfirmClick" :shadow="true" width="100%" :fontSize="26"
						:backgroundColor="disabled ? '#E6E6E6' : '#39b54a'" fontColor="#FFFFFF" margin="10rpx 0">通过</tn-button>
				</view>
			</view>
		</view>


		<view class="tn-margin-top tn-bg-white tn-padding-sm">
			<view class="tn-flex tn-flex-col-center tn-flex-row-between">
				<view class="">
					<text class="tn-text-sm tn-color-gray">点击订阅申请审批通知</text>
				</view>
				<view class="">
					<tn-button @click="subscribe" class="tn-margin-left" size="sm" :shadow="false" backgroundColor="#3668FC"
						fontColor="#FFFFFF">订阅
					</tn-button>
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
		<tn-toast ref="toast"></tn-toast>

		<tn-select title="选择快捷键入语" confirmColor="#3668FC" v-model="showSelect" mode="single" :list="phrases"
			@confirm="handleSelectConfirm" :searchShow="false"></tn-select>

		<tn-modal :showCloseBtn="true" @click="handleSubmitConfirm" v-model="showConfirmModal" :title="'提示'"
			:content="'您确认要通过该补卡申请吗'" :button="button"></tn-modal>

		<tn-modal :showCloseBtn="true" @click="handleRejctConfirm" v-model="showRejectModal" :title="'提示'"
			:content="'您确认要驳回该补卡申请吗'" :button="button"></tn-modal>

		<tn-modal :showCloseBtn="true" @click="showServiceErrorModal = false" v-model="showServiceErrorModal"
			:title="'系统提示'" :content="message" :button="serviceErrorModalButton">
		</tn-modal>

	</view>
</template>

<script>
	import {
		dateShow
	} from '@/utils/index.js'
	import {
		getRoomById
	} from '@/api/room.js'
	import {
		findByIdApi
	} from '@/api/record.js'
	import {
		querySysConfigByKeyApi
	} from '@/api/config.js'
	import {
		updateApplicationStateApi
	} from '@/api/application.js'
	export default {
		data() {
			return {
				dto: {
					matterRecordId: '',
					reason: '',
					stuNum: '',
					title: '',
					name: '',
					id: '',
					createTime: 0,
					outTime: 0
				},
				remark: '',
				record: {},
				room: {},
				disabled: false,
				phrases: [],
				showSelect: false,
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
				showConfirmModal: false,
				showRejectModal: false,
				showServiceErrorModal: false,
				message: '',
				serviceErrorModalButton: [{
					text: '我知道了',
					backgroundColor: '#3668FC',
					fontColor: '#FFFFFF',
				}],
				tmplIds: ['RUkh4a-qXYLB89EtnzuoNa4VmOskGqDkTth7sPWPs24'],
			}
		},
		onLoad(params) {
			this.dto.matterRecordId = params.matterRecordId
			this.dto.reason = params.reason
			this.dto.stuNum = params.stuNum
			this.dto.title = params.title
			this.dto.name = params.name
			this.dto.id = params.id
			this.dto.createTime = Number(params.createTime)
			this.dto.outTime = Number(params.outTime)
			findByIdApi(this.dto.matterRecordId).then(res => {
				this.record = res
				getRoomById(this.record.roomId).then(res1 => {
					this.room = res1
				})
			}).catch(e => {
				console.log(e);
			})
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

		},
		filters: {
			dateFormat(date) {
				return dateShow(date, 'yyyy年MM月dd日 hh:mm')
			},
		},
		methods: {
			handleConfirmClick() {
				if (this.remark === '') {
					this.$refs.toast.show({
						title: '请填写申请处理备注',
						duration: 1500
					})
					return
				}
				this.showConfirmModal = true
			},
			handleRjectClick() {
				if (this.remark === '') {
					this.$refs.toast.show({
						title: '请填写申请处理备注',
						duration: 1500
					})
					return
				}
				this.showRejectModal = true
			},
			handleSubmitConfirm(e) {
				this.showConfirmModal = false
				if (e.index === 1) {
					this.$refs.loading.open()
					updateApplicationStateApi(this.dto.id, true, this.remark).then(() => {
						this.$refs.loading.close()
						this.$refs.toast.show({
							title: '操作成功',
							duration: 1500
						})
						this.disabled = true
						uni.$emit('signInApprove', {
							id: this.dto.id
						})
					}).catch(e => {
						this.$refs.loading.close()
						this.disabled = true
						this.handleError(e)
					})
				}
			},
			handleRejctConfirm(e) {
				this.showRejectModal = false
				if (e.index === 1) {
					this.$refs.loading.open()
					updateApplicationStateApi(this.dto.id, false, this.remark).then(() => {
						this.$refs.loading.close()
						this.$refs.toast.show({
							title: '操作成功',
							duration: 1500
						})
						this.disabled = true
						uni.$emit('signInApprove', {
							id: this.dto.id
						})
					}).catch(e => {
						this.$refs.loading.close()
						this.disabled = true
						this.handleError(e)
					})
				}
			},
			handleSelectConfirm(e) {
				this.remark = e[0].value
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

	.text-content {
		font-size: 26rpx;
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