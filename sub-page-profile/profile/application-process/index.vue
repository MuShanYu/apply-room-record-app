<template>
	<view>
		<tn-nav-bar fixed customBack backgroundColor="#FFFFFF" :bottomShadow="false">
			<view slot="back" class='tn-custom-nav-bar__back' @click="goBack">
				<text class='icon tn-icon-left'></text>
			</view>
			<view slot="default" class="">
				申请进程
			</view>
		</tn-nav-bar>

		<view class="tabs-fixed tabs" :style="{marginTop: vuex_custom_bar_height + 'px'}">
			<view class="tn-bg-white">
				<view class="tn-flex tn-flex-col-between tn-flex-col-center">
					<view style="width: 100vw;overflow: hidden;">
						<tn-tabs :height="60" :list="applicationTypeScrollList" :current="topTabCurrent" :isScroll="true"
							activeColor="#3668FC" :bold="true" :showBar="false" :fontSize="26" @change="topTabChange"
							backgroundColor="#FFFFFF"></tn-tabs>
					</view>
				</view>
			</view>
			<view class="" style="padding: 3rpx;background-color: #F4F4F4;">

			</view>
			<view class="tn-bg-white">
				<view class="tn-flex tn-flex-col-between tn-flex-col-center">
					<view style="width: 100vw;overflow: hidden;">
						<tn-tabs :height="60" :list="scrollList" :current="current" :isScroll="true" activeColor="#3668FC"
							:fontSize="24" @change="tabChange" backgroundColor="#FFFFFF"></tn-tabs>
					</view>
				</view>
			</view>
		</view>

		<view class="tn-bg-white notice tabs-fixed" :style="{marginTop: (optionHeight + vuex_custom_bar_height) + 'px'}">
			<tn-notice-bar leftIconName="tip" :show="noticeShow" :list="noticeList" :closeBtn="true" :fontSize="24"
				@close="handleNoticeClose"></tn-notice-bar>
		</view>

		<view class="tn-padding"
			:style="{marginTop: noticeShow ? (optionHeight + noticeHeight + vuex_custom_bar_height) + 'px' : (optionHeight + vuex_custom_bar_height) + 'px'}">
			<view @click="tn(index)" class="tn-bg-white box-shadow tn-margin-bottom" v-for="(item,index) in applicationList"
				:key="item.id">
				<view class="tn-padding-top tn-padding-left tn-padding-right tn-padding-bottom-sm" style="position: relative;">
					<view class="tn-text-md tn-text-bold tn-text-ellipsis-2">
						{{item.title}}
					</view>
					<!-- tag -->
					<view class="" style="position: absolute;top: 0;right: 0;">
						<view class="" style="border-top-right-radius: 15rpx;padding: 8rpx;font-size: 18rpx;"
							:style="{backgroundColor: item.bgColor, color: item.color}">
							{{item.state | tagTextFilter}}
						</view>
					</view>
					<view class="tn-color-gray tn-margin-top-sm text-content">
						申请补卡时间：{{item.reason.outTime | dateFormat}}
					</view>
					<view class="tn-color-gray tn-margin-top-sm text-content">
						申请理由：{{item.reason.reason}}
					</view>
					<view class="tn-flex tn-flex-row-between tn-color-gray tn-text-sm tn-margin-top-sm">
						<view class="">
							<text class="tn-icon-my" style="padding-right: 6rpx;"></text> {{item.name}}(处理人)
						</view>
						<view class="">
							<text class="tn-icon-history" style="padding-right: 6rpx;"></text> {{item.createTime | dateFormat}}
						</view>
					</view>
				</view>
				<view v-if="item.state !== 0" class="" style="background-color: #F8F7F8;width: 100%;padding: 2rpx;">

				</view>
				<view v-if="item.state !== 0"
					class="text-content tn-color-gray tn-padding-left tn-padding-right tn-padding-bottom-sm"
					style="padding-top: 15rpx;">
					备注：{{item.remarks ? item.remarks : '无'}}
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

		<tn-toast @closed="" ref="toast"></tn-toast>
		<w-loading text="拼命处理中..." mask="true" click="true" ref="loading"></w-loading>

	</view>
</template>

<script>
	import {
		queryMyApplicationListApi
	} from '@/api/application.js'
	import {
		querySysConfigByKeyApi
	} from '@/api/config.js'
	import {
		dateShow,
		getBeforeTime
	} from '@/utils/index.js'
	export default {
		data() {
			return {
				current: 0,
				topTabCurrent: 0,
				applicationTypeScrollList: [{
					name: '默认',
					type: 0
				}],
				scrollList: [{
						name: '审批中',
						state: 0
					},
					{
						name: '已通过',
						state: 1
					},
					{
						name: '已驳回',
						state: 2
					},
					{
						name: '已取消',
						state: 3
					}
				],
				optionHeight: 0,
				noticeHeight: 0,
				query: {
					page: 1,
					size: 5,
					startDateStr: null,
					endDateStr: null,
					applicationState: 0,
					type: 0
				},
				applicationList: [],
				loadmore: true,
				status: 'nomore',
				showPopup: false,
				timeOption: 'none',
				noticeShow: true,
				noticeList: ['需要撤销申请？点击申请项，取消正在审批中的房间预约。']
			}
		},
		filters: {
			dateFormat(date) {
				return dateShow(date, 'yyyy年MM月dd日 hh:mm')
			},
			tagTextFilter(state) {
				switch (state) {
					case 0:
						return '审批中'
					case 1:
						return '已通过'
					case 2:
						return '已驳回'
					default:
						return '已取消'
				}
			}
		},
		mounted() {
			this.$nextTick(() => {
				const query = uni.createSelectorQuery().in(this)
				query.select('.tabs').boundingClientRect(data => {
					this.optionHeight = Math.ceil(data.height)
				})
				query.select('.notice').boundingClientRect(data => {
					this.noticeHeight = Math.ceil(data.height)
				})
				query.exec()
			})
		},
		onLoad() {
			querySysConfigByKeyApi('applicationType').then(res => {
				this.applicationTypeScrollList = JSON.parse(res.configValue).types
			})
			this.getDataList()
			this.noticeShow = uni.getStorageSync('signInProcessTip') === '' ? true : false
			// 监听取消事件
			uni.$on('applicationCancel', (data) => {
				let index = this.applicationList.findIndex(item => item.id === data.applicationId)
				this.applicationList.splice(index, 1)
			})
		},
		onReachBottom() {
			if (this.loadmore) {
				this.query.page += 1
				this.status = 'loading'
				queryMyApplicationListApi(this.query).then(res => {
					res.pageData.forEach(item => {
						item.reason = JSON.parse(item.reason)
					})
					this.setTagBgAndColor(res.pageData)
					let list = res.pageData
					if (list.length > 0) {
						this.applicationList.push(...list)
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
			queryMyApplicationListApi(this.query).then(res => {
				res.pageData.forEach(item => {
					item.reason = JSON.parse(item.reason)
				})
				this.setTagBgAndColor(res.pageData)
				this.applicationList = res.pageData
				uni.stopPullDownRefresh()
			}).catch(e => {
				console.log(e);
				uni.stopPullDownRefresh()
			})
		},
		methods: {
			topTabChange(index) {
				this.topTabCurrent = index
				uni.pageScrollTo({
					scrollTop: 0,
					duration: 300
				});
				this.query.type = this.applicationTypeScrollList[index].type
				this.query.page = 1
				this.loadmore = true
				this.getDataList()
			},
			tabChange(index) {
				this.current = index
				uni.pageScrollTo({
					scrollTop: 0,
					duration: 300
				});
				this.query.applicationState = this.scrollList[index].state
				this.query.page = 1
				this.loadmore = true
				this.getDataList()
			},
			getDataList() {
				this.$refs.loading.open()
				queryMyApplicationListApi(this.query).then(res => {
					res.pageData.forEach(item => {
						item.reason = JSON.parse(item.reason)
					})
					this.setTagBgAndColor(res.pageData)
					this.applicationList = res.pageData
					console.log(this.applicationList);
					this.$refs.loading.close()
				}).catch(e => {
					this.$refs.loading.close()
				})
			},
			handleNoticeClose() {
				this.noticeShow = false
				this.$refs.toast.show({
					title: '下次登录前不再展示该提醒',
					duration: 2500
				})
				uni.setStorageSync('signInProcessTip', false)
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
			tn(index) {
				if (this.applicationList[index].state !== 0) {
					this.$refs.toast.show({
						title: '只允许取消正在审批中的申请',
						duration: 2000
					})
					return
				}
				let item = this.applicationList[index]
				this.$Router.push({
					path: '/sub-page-profile/profile/application-process/cancel-application',
					query: {
						applicationId: item.id
					}
				})
			},
			handleQueryFilterConfirm() {
				let dateTimestamp = getBeforeTime(this.timeOption)
				this.query.startDateStr = dateShow(dateTimestamp[0], 'yyyy-MM-dd hh:mm')
				this.query.endDateStr = dateShow(dateTimestamp[1], 'yyyy-MM-dd hh:mm')
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
				this.query.stuNum = ''
				this.startDateStr = null
				this.endDateStr = null
				this.loadmore = true
			},
			setTagBgAndColor(items) {
				items.forEach(item => {
					let color = this.getTagBgAndColor(item.state)
					this.$set(item, "bgColor", color.backgroundColor)
					this.$set(item, "color", color.color)
				})
			},
			getTagBgAndColor(state) {
				switch (state) {
					case 0:
						return {
							backgroundColor: '#D8E5FF',
								color: '#4B98FE'
						}
					case 1:
						return {
							backgroundColor: '#D6FADB',
								color: '#00D05E'
						}
					case 2:
						return {
							backgroundColor: '#FFE2D9',
								color: '#FB6A67'
						}
					default:
						return {
							backgroundColor: '#aaaaaa',
								color: '#fff'
						}
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

	.tabs-fixed {
		position: fixed;
		top: 0;
		width: 100%;
		transition: all 0.25s ease-out;
		z-index: 1;
	}

	.text-content {
		font-size: 26rpx;
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