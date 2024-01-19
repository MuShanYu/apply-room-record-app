<template>
	<view>
		<tn-nav-bar fixed customBack backgroundColor="#FFFFFF" :bottomShadow="false">
			<view slot="back" class='tn-custom-nav-bar__back' @click="goBack">
				<text class='icon tn-icon-left'></text>
			</view>
			<view slot="default" class="">
				房间签到
			</view>
		</tn-nav-bar>

		<view v-if="dataList.length === 0" class="tabs-fixed tn-bg-white">
			<view class="tn-flex tn-flex-col-between tn-flex-col-center tn-padding-top-sm"
				:style="{marginTop: vuex_custom_bar_height + 'px'}">
				<view style="width: 100vw;overflow: hidden;">
					<tn-tabs :list="[{name:'暂无记录房间'}]" :current="current" :isScroll="true" activeColor="#3668FC" :bold="true"
						:fontSize="26" backgroundColor="#FFFFFF" :height="60"></tn-tabs>
				</view>
			</view>
		</view>

		<view v-else class="tabs-fixed tn-bg-white">
			<view class="tn-flex tn-flex-col-between tn-flex-col-center tn-padding-top-sm"
				:style="{marginTop: vuex_custom_bar_height + 'px'}">
				<view style="width: 100vw;overflow: hidden;">
					<tn-tabs :list="scrollList" :current="current" :isScroll="true" activeColor="#3668FC" :bold="true"
						:fontSize="26" @change="tabChange" backgroundColor="#FFFFFF" :height="60"></tn-tabs>
				</view>
			</view>
		</view>


		<view :style="{marginTop: optionHeight + 'px'}">

			<view v-if="dataList.length > 0" :style="{height: (windowHight - optionHeight) + 'px'}" class="tn-padding">
				<view class="box-shadow tn-padding tn-bg-white">
					<view class="tn-text-center tn-text-bold" style="font-size: 55rpx;">
						{{clock.hour}}:{{clock.minute}}:{{clock.second}}
					</view>
					<view class="tn-flex tn-flex-row-between tn-color-gray tn-text-df tn-margin-top tn-text-sm">
						<view class="">
							<text class="tn-icon-company" style="padding-right: 6rpx;"></text> {{dataList[current].room.school}}
						</view>
						<view class="">
							<text class="tn-icon-map" style="padding-right: 6rpx;"></text> {{dataList[current].room.teachBuilding}}
						</view>
						<view class="">
							<text class="tn-icon-menu" style="padding-right: 6rpx;"></text> {{dataList[current].room.category}}
						</view>
					</view>
				</view>

				<view class="box-shadow tn-bg-white tn-margin-top tn-padding tn-text-md tn-color-gray">
					<view class="">
						<text class="tn-icon-time" style="margin-right: 6rpx;"></text>
						{{dataList[current].record.entryTime | dateFormat}} 进入
					</view>
					<view class="tn-margin-top">
						<view v-if="dataList[current].record.outTime === null" class="">
							<text class="tn-icon-time" style="margin-right: 6rpx;"></text> 暂无离开时间
						</view>
						<view v-else class="">
							<text class="tn-icon-time" style="margin-right: 6rpx;"></text>
							{{dataList[current].record.outTime | dateFormat}} 离开
						</view>
					</view>
				</view>

				<view class="tn-text-center tn-margin-top-xl" style="">

					<tn-button width="100%" :blockRepeatClick="true" @click="handleOutClick" :shadow="true"
						backgroundColor="#3668FC" :fontSize="28" fontColor="#FFFFFF">
						<text class="">离 开</text>
					</tn-button>

				</view>

			</view>

		</view>

		<!-- 悬浮按钮-->
		<view class="">
			<view @click="handleScanCode"
				class="icon15__item--icon tn-flex tn-flex-row-center tn-flex-col-center tn-shadow-blur button-1">
				<view class="tn-icon-scan tn-color-white"></view>
			</view>
		</view>

		<tn-modal :showCloseBtn="true" @click="showServiceErrorModal = false" v-model="showServiceErrorModal"
			:title="'系统提示'" :content="message" :button="serviceErrorModalButton">
		</tn-modal>

		<tn-popup :marginTop="vuex_custom_bar_height" v-model="showEntryPopup" mode="bottom"
			:height="(windowHight - vuex_custom_bar_height) + 'px'" :closeBtn="true">
			<view class="">
				<view class="tn-padding">
					<view class="tn-text-bold tn-text-md">
						{{scanRoom.roomName}}
					</view>
					<view class="tn-color-gray tn-margin-top-sm tn-margin-bottom" style="font-size: 26rpx;">
						可容纳{{scanRoom.capacity}}人，拥有{{scanRoom.equipmentInfo}}等。
					</view>
					<view class="tn-flex tn-flex-row-between tn-color-gray">
						<view class="">
							<text class="tn-icon-company tn-text-sm" style="padding-right: 6rpx;"></text> <text
								style="font-size: 23rpx;">{{scanRoom.school}}</text>
						</view>
						<view class="">
							<text class="tn-icon-map tn-text-sm" style="padding-right: 6rpx;"></text> <text
								style="font-size: 23rpx;">{{scanRoom.teachBuilding}}</text>
						</view>
						<view class="">
							<text class="tn-icon-menu tn-text-sm" style="padding-right: 6rpx;"></text> <text
								style="font-size: 23rpx;">{{scanRoom.category}}</text>
						</view>
					</view>
				</view>
				<view class="tn-margin-top-lg tn-padding-left tn-padding-right">
					<tn-button width="100%" :blockRepeatClick="true" @click="handleEntryClick" :shadow="false"
						backgroundColor="#3668FC" :fontSize="28" fontColor="#FFFFFF">
						<text class="">进 入</text>
					</tn-button>
				</view>

			</view>
		</tn-popup>

		<w-loading text="拼命处理中..." mask="true" click="true" ref="loading"></w-loading>
		<tn-toast @closed="" ref="toast"></tn-toast>

	</view>
</template>

<script>
	import {
		getRoomById
	} from '@/api/room.js'
	import {
		addAccessRecordApi,
		queryRoomAccessRecordNowApi
	} from '@/api/record.js'
	import {
		dateShow
	} from '@/utils/index.js'
	export default {
		data() {
			return {
				windowHight: 0,
				dataList: [],
				current: 0,
				scrollList: [{
					name: '暂无记录房间',
					roomId: ''
				}],
				optionHeight: 0,
				clock: {
					hour: "00",
					minute: "00",
					second: "00",
					timer: null,
					totalCount: 0
				},
				showEntryPopup: false,
				scanRoom: {},
				serviceErrorModalButton: [{
					text: '我知道了',
					backgroundColor: '#3668FC',
					fontColor: '#FFFFFF',
				}],
				showServiceErrorModal: false,
				message: '',
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
		onLoad(params) {
			let res = uni.getWindowInfo()
			this.windowHight = res.windowHeight
			this.getDataList()
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
		methods: {
			getDataList() {
				this.$refs.loading.open()
				queryRoomAccessRecordNowApi().then(res => {
					this.dataList = res
					// 设置scroll list
					this.scrollList.splice(0, this.scrollList.length)
					this.dataList.forEach(item => {
						let obj = {
							name: item.room.roomName,
							roomId: item.room.id
						}
						this.scrollList.push(obj)
					})
					this.current = 0
					if (this.dataList.length > 0) {
						this.resetClock()
					}
					this.$refs.loading.close()
				})
			},
			tabChange(index) {
				this.current = index
				this.resetClock()
			},
			handleScanCode() {
				let that = this
				wx.scanCode({
					onlyFromCamera: true,
					success(res) {
						that.handleFirstScanInit(res.result)
					},
					fail(e) {
						that.$refs.toast.show({
							title: '二维码扫描失败',
							duration: 2000
						})
					}
				})
			},
			handleFirstScanInit(id) {
				this.$refs.loading.open()
				getRoomById(id).then(res => {
					this.scanRoom = res
					this.$refs.loading.close()
					this.showEntryPopup = true
				})
				// this.roomId = id
				// 存储正在进行的签到房间
				// uni.setStorageSync('scanedRoomId', this.roomId)
				// 获取房间信息，存储房间签到信息，开始计时

			},
			handleEntryClick() {
				this.$refs.loading.open()
				let that = this
				let addRecordDTO = {
					roomId: that.scanRoom.id,
					type: 1
				}
				this.$refs.loading.open()
				addAccessRecordApi(addRecordDTO).then(() => {
					this.$refs.loading.close()
					this.showEntryPopup = false
					this.getDataList()
				}).catch(e => {
					this.$refs.loading.close()
					this.showEntryPopup = false
					this.handleError(e)
				})
			},
			handleOutClick() {
				let that = this
				let addRecordDTO = {
					roomId: that.dataList[that.current].room.id,
					type: 2
				}
				this.$refs.loading.open()
				addAccessRecordApi(addRecordDTO).then(() => {
					this.$refs.loading.close()
					this.getDataList()
				}).catch(e => {
					this.$refs.loading.close()
					this.handleError(e)
				})
			},
			resetClock() {
				this.end()
				this.clock.hour = '00'
				this.clock.minute = '00'
				this.clock.second = '00'
				this.clock.timer = null
				this.clock.totalCount = 0
				// 计算总秒数
				let now = Date.now()
				let subTimeSeconds = now - this.dataList[this.current].record.entryTime
				this.start(subTimeSeconds)
			},
			end() {
				clearInterval(this.clock.timer);
			},
			showNum(num) {
				if (num < 10) {
					return '0' + num
				}
				return num
			},
			start(subTimeSeconds) {
				let that = this;
				let count = Math.max(0, Math.floor(subTimeSeconds / 1000)); // 总秒数，确保不为负值
				that.clock.timer = setInterval(function() {
					that.clock.hour = that.showNum(parseInt(count / 60 / 60));
					that.clock.minute = that.showNum(parseInt(count / 60) % 60);
					that.clock.second = that.showNum(count % 60);
					that.clock.totalCount = count++;;
				}, 1000);
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