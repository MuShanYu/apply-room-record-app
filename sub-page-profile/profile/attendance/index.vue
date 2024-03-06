<template>
	<view>
		<tn-nav-bar fixed customBack backgroundColor="#FFFFFF" :bottomShadow="false">
			<view slot="back" class='tn-custom-nav-bar__back' @click="goBack">
				<text class='icon tn-icon-left'></text>
			</view>
			<view slot="default" class="">
				签到详情
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

		<view class="" :style="{marginTop: optionHeight + 'px'}">
			<view class="tn-padding">
				<view class="tn-bg-white box-shadow tn-padding tn-margin-bottom" v-for="(item, index) in attendanceList"
					:key="item.id">
					<view v-if="item.outTime !== null" class="tn-text-md tn-text-bold">
						{{item.entryTime | dateFormat}}~{{item.outTime | dateHourFormat}}，共计({{item.validAttendanceHours}}H)
					</view>
					<view v-else class="tn-text-md tn-text-bold">
						{{item.entryTime | dateFormat}}进入，未进行签退。
					</view>
					<view class="tn-flex tn-flex-row-between tn-color-gray tn-text-sm tn-margin-top-sm">
						<view class="">
							<text class="tn-icon-company" style="padding-right: 6rpx;"></text> {{currentRoom.school}}
						</view>
						<view class="">
							<text class="tn-icon-map" style="padding-right: 6rpx;"></text> {{currentRoom.teachBuilding}}
						</view>
						<view class="">
							<text class="tn-icon-menu" style="padding-right: 6rpx;"></text> {{currentRoom.category}}
						</view>
						<!-- tag -->
						<view v-if="isToday(item.entryTime) && checkIsCached(item.id) && item.outTime === null" class=""
							style="position: absolute;top: 0;right: 0;">
							<view class=""
								style="border-top-right-radius: 15rpx;padding: 6rpx;font-size: 16rpx;background-color: #39b54a;color: #fff;">
								进行中
							</view>
						</view>
						<tn-badge v-if="item.outTime === null && !isToday(item.entryTime)" backgroundColor="#E83A30" :dot="true"
							:radius="15" :absolute="true" :translateCenter="false"></tn-badge>
					</view>

				</view>

				<tn-load-more :status='status'></tn-load-more>
			</view>

		</view>

		<!-- 悬浮按钮-->
		<view class="">
			<view @click="showPopup = true"
				class="icon15__item--icon tn-flex tn-flex-row-center tn-flex-col-center tn-shadow-blur button-1">
				<view class="tn-icon-more-horizontal tn-color-white"></view>
			</view>
		</view>

		<tn-popup mode="top" :marginTop="vuex_custom_bar_height" v-model="showPopup">
			<view class="tn-padding ">
				<tn-form :model="query" ref="form" :borderBottom="false" :labelWidth="160">
					<tn-form-item label="申请时间" :borderBottom="false">
						<tn-radio-group shape="square" activeColor="#3668FC" v-model="timeOption">
							<tn-radio name="none">任意</tn-radio>
							<tn-radio name="today">今天</tn-radio>
							<tn-radio name="yesterday">昨天</tn-radio>
							<tn-radio name="oneWeek">本周</tn-radio>
						</tn-radio-group>
					</tn-form-item>
				</tn-form>
				<view class="tn-flex tn-flex-row-between tn-margin-top">
					<tn-button @click="handleClearQuery" backgroundColor="tn-bg-gray" fontColor="#FFFFFF">重 置</tn-button>
					<tn-button @click="handleQueryFilterConfirm" backgroundColor="#3668FC" fontColor="#FFFFFF">确 认</tn-button>
				</view>
			</view>
		</tn-popup>

		<w-loading text="拼命处理中..." mask="true" click="true" ref="loading"></w-loading>
		<tn-toast @closed="" ref="toast"></tn-toast>

	</view>
</template>

<script>
	import {
		queryAccessRecordRoomListApi
	} from '@/api/room.js'
	import {
		queryRoomAccessRecordNowApi
	} from '@/api/record.js'
	import {
		dateShow,
		getBeforeTime
	} from '@/utils/index.js'
	import {
		queryAttendanceCountDetailList
	} from '@/api/attendance.js'
	export default {
		data() {
			return {
				current: 0,
				scrollList: [{
					name: '暂无记录房间',
					roomId: '',
					room: {}
				}],
				optionHeight: 0,
				query: {
					page: 1,
					size: 10,
					userId: '',
					roomId: '',
					startTime: null,
					endTime: null
				},
				loadmore: true,
				attendanceList: [],
				currentRoom: {
					school: '',
					teachBuilding: '',
					category: ''
				},
				status: 'nomore',
				showPopup: false,
				timeOption: 'none',
				cachedRecordIds: []
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
		},
		onLoad() {
			this.query.userId = uni.getStorageSync('userInfo').id
			queryAccessRecordRoomListApi().then(res => {
				if (res.length !== 0) {
					this.scrollList.splice(0, 1)
					res.forEach(item => {
						let listItem = {
							name: item.roomName,
							roomId: item.id,
							room: item
						}
						this.scrollList.push(listItem)
					})
					this.query.roomId = this.scrollList[this.current].roomId
					this.currentRoom.school = this.scrollList[this.current].room.school
					this.currentRoom.teachBuilding = this.scrollList[this.current].room.teachBuilding
					this.currentRoom.category = this.scrollList[this.current].room.category
					this.getDataList()
					this.getCachedRoomAccessRecord()
				}
			})

		},
		onPullDownRefresh() {
			this.query.page = 1
			this.loadmore = true
			// 清空旧的缓存id
			this.cachedRecordIds = []
			this.getCachedRoomAccessRecord()
			queryAttendanceCountDetailList(this.query).then(res => {
				this.attendanceList = res.pageData
				uni.stopPullDownRefresh()
			}).catch(e => {
				console.log(e)
				uni.stopPullDownRefresh()
			})
		},
		onReachBottom() {
			if (this.loadmore) {
				this.query.page += 1
				this.status = 'loading'
				queryAttendanceCountDetailList(this.query).then(res => {
					if (res.pageData.length > 0) {
						this.attendanceList.push(...res.pageData)
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
			tabChange(index) {
				this.current = index
				uni.pageScrollTo({
					scrollTop: 0,
					duration: 300
				});
				this.query.roomId = this.scrollList[index].roomId
				this.currentRoom.school = this.scrollList[index].room.school
				this.currentRoom.teachBuilding = this.scrollList[index].room.teachBuilding
				this.currentRoom.category = this.scrollList[index].room.category
				this.query.page = 1
				this.loadmore = true
				this.getDataList()
			},
			getDataList() {
				// 要有可以请求的房间列表
				if (this.scrollList[0].roomId !== '') {
					this.$refs.loading.open()
					queryAttendanceCountDetailList(this.query).then(res => {
						this.attendanceList = res.pageData
						// console.log(this.attendanceList);
						this.$refs.loading.close()
					}).catch(e => {
						this.$refs.loading.close()
					})
				}

			},
			getCachedRoomAccessRecord() {
				queryRoomAccessRecordNowApi().then(res => {
					res.forEach(item => {
						this.cachedRecordIds.push(item.record.id)
					})
				})
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
				let dateTimestamp = getBeforeTime(this.timeOption)
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
				this.query.startTime = null
				this.query.endTime = null
				this.loadmore = true
			},
			checkIsCached(recordId) {
				return this.cachedRecordIds.includes(recordId)
			},
			isToday(entryTime) {
				// 获取当前日期
				const currentDate = new Date();

				// 获取当前日期的年、月、日部分
				const currentYear = currentDate.getFullYear();
				const currentMonth = currentDate.getMonth();
				const currentDay = currentDate.getDate();

				// 使用时间戳创建一个Date对象
				const dateFromTimestamp = new Date(entryTime);

				// 获取时间戳对应日期的年、月、日部分
				const yearFromTimestamp = dateFromTimestamp.getFullYear();
				const monthFromTimestamp = dateFromTimestamp.getMonth();
				const dayFromTimestamp = dateFromTimestamp.getDate();

				// 判断是否是同一天
				return currentYear === yearFromTimestamp && currentMonth === monthFromTimestamp && currentDay ===
					dayFromTimestamp;

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
</style>