<template>
	<view>
		<tn-nav-bar fixed customBack backgroundColor="#FFFFFF" :bottomShadow="false">
			<view slot="back" class='tn-custom-nav-bar__back' @click="goBack">
				<text class='icon tn-icon-left'></text>
			</view>
			<view slot="default" class="">
				预约进程
			</view>
		</tn-nav-bar>

		<view class="tabs-fixed tn-bg-white">
			<view class="tn-flex tn-flex-col-between tn-flex-col-center tn-padding-top-sm"
				:style="{marginTop: vuex_custom_bar_height + 'px'}">
				<view style="width: 100vw;overflow: hidden;">
					<tn-tabs :list="scrollList" :current="current" :isScroll="true" activeColor="#3668FC" :bold="true"
						:fontSize="26" @change="tabChange" backgroundColor="#FFFFFF" :height="60"></tn-tabs>
				</view>
			</view>
		</view>

		<view class="tn-bg-white notice tabs-fixed" :style="{marginTop: optionHeight + 'px'}">
			<tn-notice-bar leftIconName="tip" :show="noticeShow" :list="noticeList" :closeBtn="true" :fontSize="24"
				@close="noticeShow = false"></tn-notice-bar>
		</view>

		<view class="tn-padding"
			:style="{marginTop: noticeShow ? (optionHeight + noticeHeight) + 'px' : optionHeight + 'px'}">
			<view @click="tn(index)" class="tn-bg-white box-shadow tn-padding tn-margin-bottom"
				v-for="(item, index) in reservationList" :key="item.id">
				<!-- 线 -->
				<view class="left-line" :style="{backgroundColor: tagBgColor}">
				</view>
				<view class="tn-flex tn-flex-row-between">
					<view class="tn-text-bold tn-text-md tn-text-ellipsis">
						{{item.roomName}}
					</view>
					<view class="tn-color-gray text-content">
						{{item.createTime | dateFormat}}
					</view>
				</view>
				<view class="tn-margin-top-sm tn-text-bold text-content">
					预约时间：{{item.reserveStartTime | dateFormat}}~{{item.reserveEndTime | dateHourFormat}}
				</view>
				<view class="tn-margin-top-sm tn-color-gray text-content">
					房间用途：{{item.roomUsage}}
				</view>
				<view class="tn-flex tn-flex-row-between tn-color-gray tn-text-sm tn-margin-top-sm">
					<view class="">
						<text class="tn-icon-company" style="padding-right: 6rpx;"></text> {{item.school}}
					</view>
					<view class="">
						<text class="tn-icon-map" style="padding-right: 6rpx;"></text> {{item.teachBuilding}}
					</view>
					<view class="">
						<text class="tn-icon-menu" style="padding-right: 6rpx;"></text> {{item.category}}
					</view>
				</view>
				<view v-if="item.state !== 0" class="tn-margin-top-sm tn-color-gray text-content">
					备注：{{item.remark ? item.remark : '无'}}
				</view>
			</view>
			<tn-load-more :status='status'></tn-load-more>

		</view>

		<!-- 悬浮按钮-->
		<view class="">
			<view @click="showPopup = true"
				class="icon15__item--icon tn-flex tn-flex-row-center tn-flex-col-center tn-shadow-blur button-1">
				<view class="tn-icon-more-horizontal tn-color-white"></view>
			</view>
		</view>

		<tn-popup mode="top" :marginTop="vuex_custom_bar_height" v-model="showPopup">
			<view class="tn-padding">
				<tn-form :model="query" ref="form" :borderBottom="false" :labelWidth="160">
					<tn-form-item label="房间名称" prop="stuNum" :borderBottom="false">
						<tn-input placeholder="请输入要搜索的房间名称" v-model="query.roomName" />
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

		<tn-toast @closed="" ref="toast"></tn-toast>
		<w-loading text="拼命处理中..." mask="true" click="true" ref="loading"></w-loading>
	</view>
</template>

<script>
	import {
		myReservationApi,
		cancelReserveRoomApi
	} from '@/api/room.js'
	import {
		dateShow,
		getTime
	} from '@/utils/index.js'
	export default {
		data() {
			return {
				reservationList: [],
				query: {
					page: 1,
					size: 10,
					roomName: '',
					startTime: null,
					endTime: null,
					state: 0
				},
				current: 0,
				scrollList: [{
						name: '审批中',
						count: 0,
						state: 0
					},
					{
						name: '已通过',
						count: 0,
						state: 1
					},
					{
						name: '已驳回',
						count: 0,
						state: 3
					},
					{
						name: '已取消',
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
				noticeHeight: 0,
				loadmore: true,
				tagBgColor: '#4B98FE',
				status: 'nomore',
				showPopup: false,
				timeOption: 'none',
				noticeShow: true,
				noticeList: ['需要取消预约？点击预约项，取消正在审批中的房间预约。'],
				currentOperateIndex: 0
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
				query.select('.notice').boundingClientRect(data => {
					this.noticeHeight = Math.ceil(data.height)
				})
				query.exec()
			})
		},
		onLoad() {
			this.getDataList()
			// 监听取消事件
			uni.$on('roomCancel', (data) => {
				let index = this.reservationList.findIndex(item => item.id === data.reservationId)
				this.reservationList.splice(index, 1)
			})
		},
		onReachBottom() {
			if (this.loadmore) {
				this.query.page += 1
				this.status = 'loading'
				myReservationApi(this.query).then(res => {
					this.getTagBg(this.query.state)
					let list = res.pageData
					if (list.length > 0) {
						this.reservationList.push(...list)
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
		onPullDownRefresh() {
			this.query.page = 1
			this.loadmore = true
			myReservationApi(this.query).then(res => {
				this.getTagBg(this.query.state)
				this.reservationList = res.pageData
				uni.stopPullDownRefresh()
			}).catch(e => {
				console.log(e);
				uni.stopPullDownRefresh()
			})
		},
		methods: {
			getDataList() {
				this.$refs.loading.open()
				myReservationApi(this.query).then(res => {
					this.getTagBg(this.query.state)
					this.reservationList = res.pageData
					this.$refs.loading.close()
					// console.log(this.reservationList);
				}).catch(e => {
					this.$refs.loading.close()
				})
			},
			tabChange(index) {
				this.current = index
				this.query.state = this.scrollList[index].state
				uni.pageScrollTo({
					scrollTop: 0,
					duration: 300
				});
				this.query.page = 1
				this.loadmore = true
				this.getDataList()
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
				uni.pageScrollTo({
					scrollTop: 0,
					duration: 300
				})
				this.getDataList()
			},
			resetQuery() {
				this.query.page = 1
				this.query.roomName = ''
				this.query.startTime = null
				this.query.endTime = null
				this.loadmore = true
			},
			tn(index) {
				if (this.reservationList[index].state !== 0) {
					this.$refs.toast.show({
						title: '只允许取消正在审批中的房间预约申请',
						duration: 2000
					})
					return
				}
				let item = this.reservationList[index]
				this.$Router.push({
					path: '/sub-page-profile/profile/apply-room-process/cancel-room-apply',
					query: {
						reservationId: item.id,
						roomName: item.roomName
					}
				})
			},
			getTagBg(state) {
				let that = this
				switch (state) {
					case 0:
						that.tagBgColor = '#4B98FE';
						break;
					case 1:
						that.tagBgColor = '#00D05E';
						break;
					case 2:
						that.tagBgColor = '#f37b1d';
						break;
					case 3:
						that.tagBgColor = '#FB6A67';
						break;
					case 4:
						that.tagBgColor = '#aaaaaa';
						break;
					default:
						that.tagBgColor = '#4B98FE';
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

	.text-content {
		font-size: 26rpx;
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
		position: relative;
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

	.left-line {
		height: 100%;
		width: 1%;
		background-color: red;
		position: absolute;
		left: 0;
		top: 0;
		border-top-left-radius: 15rpx;
		border-bottom-left-radius: 15rpx;
	}
</style>