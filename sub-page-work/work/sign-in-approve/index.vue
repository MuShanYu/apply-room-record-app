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
					<tn-tabs :list="scrollList" :current="current" :isScroll="false" activeColor="#3668FC" :bold="true"
						:fontSize="32" @change="tabChange" backgroundColor="#FFFFFF" :height="70"></tn-tabs>
				</view>
			</view>
		</view>

		<view class="" :style="{marginTop: optionHeight + 'px'}">
			<view class="tn-padding">
				<view @click="tn(item)" class="tn-bg-white box-shadow tn-padding tn-margin-bottom"
					v-for="(item, index) in applicationList" :key="item.id">
					<view class="tn-flex">
						<text class="tn-text-bold tn-text-ellipsis tn-text-md">
							{{item.title}}
						</text>
					</view>
					<!-- tag -->
					<view class="" style="position: absolute;top: 0;right: 0;">
						<view class="" style="border-top-right-radius: 15rpx;padding: 4rpx;font-size: 18rpx;"
							:style="{backgroundColor: item.bgColor, color: item.color}">
							{{item.state | tagTextFilter}}
						</view>
					</view>
					<view class="tn-margin-top-xs tn-color-gray" style="font-size: 27rpx;">
						申请理由：{{JSON.parse(item.reason).reason}}
					</view>
					<view class="tn-margin-top tn-flex tn-flex-row-between tn-color-gray tn-text-sm">
						<view class="">
							<text class="tn-icon-identity tn-text-sm" style="padding-right: 8rpx;"></text> {{item.stuNum}}
						</view>
						<view class="">
							<text class="tn-icon-time tn-text-sm" style="padding-right: 8rpx;"></text>
							{{item.createTime | dateFormat}}
						</view>
					</view>
				</view>
				<tn-load-more :status='status'></tn-load-more>
			</view>

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

		<tn-popup mode="top" :marginTop="vuex_custom_bar_height" v-model="showPopup">
			<view class="tn-padding">
				<tn-form :model="query" ref="form" :borderBottom="false" :labelWidth="160">
					<tn-form-item label="学号/工号" prop="stuNum" :borderBottom="false">
						<tn-input placeholder="请输入要搜索的学号/工号" v-model="query.stuNum" />
					</tn-form-item>
					<tn-form-item label="快捷选项" :borderBottom="false">
						<tn-radio-group shape="square" activeColor="#3668FC" v-model="timeOption">
							<tn-radio name="none">任意</tn-radio>
							<tn-radio name="today">今天</tn-radio>
							<tn-radio name="tomorrow">明天</tn-radio>
							<tn-radio name="afterTomorrow">后天</tn-radio>
						</tn-radio-group>
					</tn-form-item>
				</tn-form>
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
		queryApplicationListApi
	} from '@/api/application.js'
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
						state: 2
					}
				],
				optionHeight: 0,
				query: {
					page: 1,
					size: 5,
					stuNum: '',
					startDateStr: null,
					endDateStr: null,
					applicationState: 0
				},
				applicationList: [],
				loadmore: true,
				status: 'nomore',
				showPopup: false,
				timeOption: 'none'
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
		filters: {
			dateFormat(date) {
				return dateShow(date, 'yyyy年MM月dd日 hh:mm')
			},
			tagTextFilter(state) {
				switch (state) {
					case 0:
						return '待审批'
					case 1:
						return '已审批'
					case 2:
						return '已驳回'
					default:
						return '待审批'
				}
			}
		},
		computed: {
			defaultStartTime() {
				return dateShow(Number(new Date()), 'yyyy-MM-dd hh:mm')
			},
			defaultEndTime() {
				return dateShow(Number(new Date()) + 3600000, 'yyyy-MM-dd hh:mm')
			}
		},
		onLoad() {
			this.getDataList()
			// 监听申请事件
			uni.$on('signInApprove', (data) => {
				let index = this.applicationList.findIndex(item => item.id === data.id)
				this.applicationList.splice(index, 1)
			})
		},
		onReachBottom() {
			if (this.loadmore) {
				this.query.page += 1
				this.status = 'loading'
				queryApplicationListApi(this.query).then(res => {
					if (res.pageData.length > 0) {
						this.setTagBgAndColor(res.pageData)
						this.applicationList.push(...res.pageData)
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
			queryApplicationListApi(this.query).then(res => {
				this.setTagBgAndColor(res.pageData)
				this.applicationList = res.pageData
				// console.log(res);
				uni.stopPullDownRefresh()
			}).catch(e => {
				console.log(e);
				uni.stopPullDownRefresh()
			})
		},
		methods: {
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
				queryApplicationListApi(this.query).then(res => {
					this.setTagBgAndColor(res.pageData)
					this.applicationList = res.pageData
					// console.log(this.applicationList);
					this.$refs.loading.close()
				}).catch(e => {
					console.log(e);
					this.$refs.loading.close()
				})
			},
			tn(item) {
				this.$Router.push({
					path: '/sub-page-work/work/sign-in-approve/sign-in-approve-detail',
					query: {
						matterRecordId: item.matterRecordId,
						reason: item.reason,
						stuNum: item.stuNum,
						title: item.title,
						name: item.name,
						id: item.id,
						createTime: item.createTime
					}
				})
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
				let dateTimestamp = this.getTime(this.timeOption)
				this.query.startDateStr = dateTimestamp[0]
				this.query.endDateStr = dateTimestamp[1]
				this.showPopup = false
				this.query.page = 1
				this.getDataList()
			},
			resetQuery() {
				this.query.page = 1
				this.query.stuNum = ''
				this.startDateStr = null
				this.endDateStr = null
				this.loadmore = true
			},
			setTagBgAndColor(applicationItems) {
				applicationItems.forEach(item => {
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
							backgroundColor: '#D8E5FF',
								color: '#4B98FE'
						}
				}
			},
			getTime(dateOption) {
				let today = new Date()
				// 设置时间为 00:00:00
				today.setHours(0, 0, 0, 0);
				switch (dateOption) {
					case 'today':
						// 获取今天 00:00:00 的时间戳
						let todayStartTimestamp = today.getTime();
						// 获取今天 23:59:59 的时间戳
						let todayEndTimestamp = todayStartTimestamp + 24 * 60 * 60 * 1000 - 1;
						return [dateShow(todayStartTimestamp, 'yyyy-MM-dd hh:mm'), dateShow(todayEndTimestamp, 'yyyy-MM-dd hh:mm')]
					case 'tomorrow':
						let tomorrow = new Date(today);
						tomorrow.setDate(today.getDate() + 1);
						// 获取明天 00:00:00 的时间戳
						let tomorrowStartTimestamp = tomorrow.getTime();
						// 获取明天 23:59:59 的时间戳
						let tomorrowEndTimestamp = tomorrowStartTimestamp + 24 * 60 * 60 * 1000 - 1;
						return [dateShow(tomorrowStartTimestamp, 'yyyy-MM-dd hh:mm'), dateShow(tomorrowEndTimestamp,
							'yyyy-MM-dd hh:mm')]
					case 'afterTomorrow':
						// 获取后天的日期对象
						let dayAfterTomorrow = new Date(today);
						dayAfterTomorrow.setDate(today.getDate() + 2);
						// 获取后天 00:00:00 的时间戳
						let dayAfterTomorrowStartTimestamp = dayAfterTomorrow.getTime();
						// 获取后天 23:59:59 的时间戳
						let dayAfterTomorrowEndTimestamp = dayAfterTomorrowStartTimestamp + 24 * 60 * 60 * 1000 - 1;
						return [dateShow(dayAfterTomorrowStartTimestamp, 'yyyy-MM-dd hh:mm'), dateShow(
							dayAfterTomorrowStartTimestamp, 'yyyy-MM-dd hh:mm')]
					default:
						return [null, null]
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