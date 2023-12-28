<template>
	<view>
		<tn-nav-bar fixed customBack backgroundColor="#FFFFFF" :bottomShadow="false">
			<view slot="back" class='tn-custom-nav-bar__back' @click="goBack">
				<text class='icon tn-icon-left'></text>
			</view>
			<view slot="default" class="">
				预约审批
			</view>
		</tn-nav-bar>

		<view class="tabs-fixed tn-bg-white">
			<view class="tn-flex tn-flex-col-between tn-flex-col-center tn-padding-top-sm"
				:style="{marginTop: vuex_custom_bar_height + 'px'}">
				<view style="width: 100vw;overflow: hidden;">
					<tn-tabs :list="scrollList" :current="current" :isScroll="true" activeColor="#3668FC" :bold="true"
						:fontSize="32" @change="tabChange" backgroundColor="#FFFFFF" :height="70"></tn-tabs>
				</view>
			</view>
		</view>

		<view class="tn-padding" :style="{marginTop: optionHeight + 'px'}">
			<view class="tn-bg-white box-shadow tn-padding tn-margin-bottom" v-for="(item, index) in reservationList"
				:key="item.id">
				<view class="tn-flex tn-flex-row-between tn-flex-col-center">
					<view class="tn-text-lg tn-text-bold">
						{{item.roomName}}
					</view>
					<view class="tn-color-gray">
						{{item.createTime | dateFormat}}
					</view>
				</view>
				<view class="tn-margin-top-sm tn-color-gray">
					申请理由：{{item.roomUsage}}
				</view>
				<view class="tn-margin-top-sm tn-color-gray">
					预约时间：{{item.reserveStartTime | dateFormat}}~{{item.reserveEndTime | dateHourFormat}}
				</view>
				<view class="tn-flex tn-flex-row-between tn-color-gray tn-text-df tn-margin-top-sm">
					<view class="">
						<text class="tn-icon-identity tn-text-xl" style="padding-right: 8rpx;"></text> {{item.stuNum}}
					</view>
					<view class=""> 
						<text class="tn-icon-my tn-text-xl" style="padding-right: 8rpx;"></text> {{item.name}}
					</view>
					<view class="">
						<text class="tn-icon-menu tn-text-xl" style="padding-right: 8rpx;"></text> {{item.category}}
					</view>
				</view>
				<view class="tn-margin-top-sm tn-flex tn-flex-row-between">
					<view class="">
						<tn-button @click="handleConfirmClick(item, index, false)" :disabled="item.state !== 0"
							:backgroundColor="item.state !== 0 ? '#E6E6E6' : '#e54d42'" height='64rpx' width="144rpx" class=""
							:shadow="false" fontColor="#FFFFFF">驳回
						</tn-button>
					</view>
					<view class="">
						<tn-button @click="handleConfirmClick(item, index, true)" :disabled="item.state !== 0"
							:backgroundColor="item.state !== 0 ? '#E6E6E6' : '#39b54a'" height='64rpx' width="144rpx" class=""
							:shadow="false" fontColor="#FFFFFF">通过
						</tn-button>
					</view>
				</view>
				<view v-if="item.state !== 0" class="tn-margin-top-sm tn-color-gray tn-text-df">
					<view class="">
						备注：{{item.remark}}
					</view>
				</view>
			</view>

		</view>

		<w-loading text="拼命处理中..." mask="true" click="true" ref="loading"></w-loading>
		<tn-toast @closed="" ref="toast"></tn-toast>
		
		<tn-modal @click="handleConfirm" :radius='40' v-model="showConfirmModal" :title="'提示'"
			:content="'您确认要通过该房间预约申请吗'" :button="button"></tn-modal>
		
		<tn-modal @click="showServiceErrorModal = false" :radius='40' v-model="showServiceErrorModal" :title="'系统提示'"
			:content="message" :button="serviceErrorModalButton">
		</tn-modal>

	</view>
</template>

<script>
	import {
		queryRoomReserveToBeReviewedApi,
		passOrRejectReserveApi
	} from '@/api/room.js'
	import {
		dateShow
	} from '@/utils/index.js'
	export default {
		data() {
			return {
				current: 0,
				scrollList: [{
						name: '待审批',
						count: 0,
						state: 0
					},
					{
						name: '已审批',
						count: 0,
						state: 1
					},
					{
						name: '已驳回',
						count: 0,
						state: 3
					},
					{
						name: '用户已取消',
						count: 0,
						state: 2
					},
					{
						name: '超时未处理',
						count: 0,
						state: 4
					}
				],
				optionHeight: 0,
				query: {
					page: 1,
					size: 20,
					stuNum: '',
					state: 0
				},
				reservationList: [],
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
				currentItem: {},
				currentIndex: 0,
				showServiceErrorModal: false,
				message: ''
			}
		},
		filters: {
			dateFormat(date) {
				return dateShow(date, 'yyyy年MM月dd日 hh:mm')
			},
			dateHourFormat(date) {
				return dateShow(date, 'hh:mm')
			}
		},
		mounted() { 
			this.$nextTick(() => {
				const query = uni.createSelectorQuery().in(this)
				query.select('.tabs-fixed').boundingClientRect(data => {
					this.optionHeight = Math.ceil(data.height)
				})
				query.exec()
			})
			this.getDataList()
		},
		methods: {
			async tabChange(index) {
				this.current = index
				this.query.state = this.scrollList[index].state
				uni.pageScrollTo({
					scrollTop: 0,
					duration: 300
				});
				await this.getDataList()
			},
			async getDataList() {
				return new Promise((resolve, reject) => {
					this.$refs.loading.open()
					queryRoomReserveToBeReviewedApi(this.query).then(res => {
						this.reservationList = res.pageData
						// console.log(res);
						this.$refs.loading.close()
						resolve()
					}).catch(e => {
						console.log(e);
						this.$refs.loading.close()
						resolve()
					})
				})
			},
			handleConfirmClick(item, index, pass) {
				if (!pass) {
					this.$Router.push({
						path: '/pages/sub-page/work/approve-room/approve-reject',
						query: {
							reserveId: item.id
						}
					})
				} else {
					this.currentItem = Object.assign({}, item)
					this.currentIndex = index
					this.showConfirmModal = true
				}
			},
			handleConfirm(e) {
				let that = this
				this.showConfirmModal = false
				if (e.index === 1) {
					// confirm
					this.$refs.loading.open()
					passOrRejectReserveApi(this.currentItem.id, true, '').then(res => {
						this.$refs.loading.close()
						this.reservationList.splice(this.currentIndex , 1)
						this.$refs.toast.show({
							title: '操作成功',
							duration: 1500
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

	.tabs-fixed {
		position: fixed;
		top: 0;
		width: 100%;
		transition: all 0.25s ease-out;
		z-index: 1;
	}

	.box-shadow {
		border-radius: 15rpx;
		box-shadow: 0rpx 0rpx 50rpx 0rpx rgba(0, 0, 0, 0.07);
		// position: relative;
	}
</style>