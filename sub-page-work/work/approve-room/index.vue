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
				<view class="tn-margin-top-sm">
					申请理由：{{item.roomUsage}}
				</view>
				<view class="tn-margin-top-sm tn-text-bold">
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
					<view class="tn-flex-basic-xs">
						<tn-button @click="handleConfirmClick(item, index, false)" :disabled="item.state !== 0"
							:backgroundColor="item.state !== 0 ? '#E6E6E6' : '#e54d42'" class="" :shadow="false"
							fontColor="#FFFFFF">驳回
						</tn-button>
					</view>
					<view class="tn-flex-basic-xs">
						<tn-button @click="handleConfirmClick(item, index, true)" :disabled="item.state !== 0"
							:backgroundColor="item.state !== 0 ? '#E6E6E6' : '#39b54a'" class="" :shadow="false"
							fontColor="#FFFFFF">通过
						</tn-button>
					</view>
				</view>
				<view v-if="item.state !== 0" class="tn-margin-top-sm tn-color-gray tn-text-df">
					<view class="tn-margin-bottom-sm">
						操作时间：{{item.updateTime | dateFormat}}
					</view>
					<view class="">
						备注：{{item.remark}}
					</view>
				</view>
			</view>
			<tn-load-more :status='status'></tn-load-more>
		</view>

		<!-- 悬浮按钮-->
		<view class="">
			<view @click="handleMoreClick"
				class="icon15__item--icon tn-flex tn-flex-row-center tn-flex-col-center tn-shadow-blur button-1">
				<view class="tn-icon-more-horizontal tn-color-white"></view>
			</view>
		</view>

		<w-loading text="拼命处理中..." mask="true" click="true" ref="loading"></w-loading>
		<tn-toast @closed="" ref="toast"></tn-toast>

		<tn-modal :showCloseBtn="true" @click="handleConfirm" v-model="showConfirmModal" :title="'提示'"
			:content="'您确认要通过该房间预约申请吗'" :button="button"></tn-modal>

		<tn-modal :showCloseBtn="true" @click="showServiceErrorModal = false" v-model="showServiceErrorModal"
			:title="'系统提示'" :content="message" :button="serviceErrorModalButton">
		</tn-modal>

		<tn-popup mode="top" :marginTop="vuex_custom_bar_height" v-model="showPopup">
			<view class="tn-padding">
				<tn-form :model="query" ref="form" :borderBottom="false" :labelWidth="160">
					<tn-form-item label="学号/工号" prop="stuNum" :borderBottom="false">
						<tn-input placeholder="请输入要搜索的学号/工号" v-model="query.stuNum" />
					</tn-form-item>
					<tn-form-item label="预约时间" :borderBottom="false">
						<tn-radio-group shape="square" activeColor="#3668FC" v-model="timeOption">
							<tn-radio name="none">任意</tn-radio>
							<tn-radio name="today">今天</tn-radio>
							<tn-radio name="tomorrow">明天</tn-radio>
							<tn-radio name="afterTomorrow">后天</tn-radio>
						</tn-radio-group>
					</tn-form-item>
				</tn-form>
				<view class="tn-flex tn-flex-row-between tn-margin-top">
					<tn-button @click="handleClearQuery" backgroundColor="tn-bg-gray" fontColor="#FFFFFF">重 置</tn-button>
					<tn-button @click="handleQueryFilterConfirm" backgroundColor="#3668FC" fontColor="#FFFFFF">确 认</tn-button>
				</view>
			</view>
		</tn-popup>

	</view>
</template>

<script>
	import {
		queryRoomReserveToBeReviewedApi,
		passOrRejectReserveApi
	} from '@/api/room.js'
	import {
		dateShow,
		getTime
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
					size: 10,
					stuNum: '',
					state: 0,
					stuNum: '',
					startTime: null,
					endTime: null
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
				message: '',
				serviceErrorModalButton: [{
					text: '我知道了',
					backgroundColor: '#3668FC',
					fontColor: '#FFFFFF',
				}],
				loadmore: true,
				status: 'nomore',
				showPopup: false,
				timeOption: 'none'

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
		onLoad() {
			// 监听驳回事件
			uni.$on('reserveRejected', (data) => {
				let index = this.reservationList.findIndex(item => item.id === data.reserveId)
				this.reservationList.splice(index, 1)
			})
		},
		onPullDownRefresh() {
			this.resetQuery()
			queryRoomReserveToBeReviewedApi(this.query).then(res => {
				this.reservationList = res.pageData
				// console.log(res);
				uni.stopPullDownRefresh()
			}).catch(e => {
				console.log(e);
				uni.stopPullDownRefresh()
			})
		},
		onReachBottom() {
			if (this.loadmore) {
				this.query.page += 1
				this.status = 'loading'
				queryRoomReserveToBeReviewedApi(this.query).then(res => {
					if (res.pageData.length > 0) {
						this.reservationList.push(...res.pageData)
					} else {
						this.loadmore = false
					}
					this.status = 'nomore'
				}).catch(e => {
					console.log(e);
					this.status = 'nomore'
				})
			}
		},
		methods: {
			async tabChange(index) {
				this.current = index
				this.query.state = this.scrollList[index].state
				uni.pageScrollTo({
					scrollTop: 0,
					duration: 300
				});
				this.query.page = 1
				this.loadmore = true
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
						path: '/sub-page-work/work/approve-room/approve-reject',
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
						this.reservationList.splice(this.currentIndex, 1)
						this.$refs.toast.show({
							title: '操作成功',
							duration: 1500
						})
					}).catch(e => {
						this.$refs.loading.close()
						this.handleError(e)
					})
				}
			},
			handleMoreClick() {
				this.showPopup = true
			},
			handleClearQuery() {
				this.timeOption = 'none'
				this.resetQuery()
				this.showPopup = false
				uni.pageScrollTo({
					scrollTop: 0,
					duration: 300
				})
				this.getDataList()
			},
			handleQueryFilterConfirm() {
				let dateTimestamp = getTime(this.timeOption)
				this.query.startTime = dateTimestamp[0]
				this.query.endTime = dateTimestamp[1]
				this.showPopup = false
				this.query.page = 1
				this.getDataList()
			},
			resetQuery() {
				this.query.page = 1
				this.query.stuNum = ''
				this.query.startTime = null
				this.query.endTime = null
				this.loadmore = true
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