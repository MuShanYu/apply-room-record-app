<template>
	<view>
		<tn-nav-bar fixed customBack>
			<view slot="back" class='tn-custom-nav-bar__back' @click="goBack">
				<text class='icon tn-icon-left'></text>
			</view>
			<view slot="default" class="">
				公告
			</view>
		</tn-nav-bar>
		<view class="tn-padding" :style="{marginTop: vuex_custom_bar_height + 'px'}">
			<view @click="handleNoticeClick(item)" class="tn-bg-white tn-padding tn-margin-bottom box-shadow" v-for="(item, index) in noticeList" :key="item.id">
				<view class="tn-margin-bottom-sm tn-text-bold tn-text-lg tn-text-ellipsis">
					<text class="tn-icon-notice-fill tn-color-red tn-text-lg tn-margin-right-xs"></text>{{item.title}}
				</view>
				<view class="tn-color-gray tn-margin-bottom-sm tn-text-ellipsis-2" style="word-break: break-all;">
					{{item.content}}
				</view>
				<view class="tn-flex tn-flex-row-between tn-color-gray">
					<view class="">
						{{item.publishUserName}}
					</view>
					<view class="">
						{{item.createTime | dateFormat }}
					</view>
				</view>
			</view>
			<tn-load-more :status='status'></tn-load-more>
		</view>
		<tn-modal v-model="showTipModal" custom>
			<view class="" style="border-radius: 60rpx;">
				<view class="tn-text-bold tn-text-center tn-margin-bottom">
					公告内容
				</view>
				<view class="" style="word-break: break-all;">
					{{message}}
				</view>
			</view>
		</tn-modal>
		
		
		
	</view>
</template>

<script>
	import {
		queryNoticeListApi
	} from '@/api/notice.js'
	import {dateShow} from '@/utils/index.js'
	export default {
		data() {
			return {
				noticeList: [],
				query: {
					page: 1,
					size: 5
				},
				status: 'nomore',
				loadmore: true,
				showTipModal: false,
				message: '',
				tipModalBtn: [{
					text: '知道了',
					backgroundColor: '#3668FC',
					fontColor: '#FFFFFF',
				}],
			}
		},
		filters: {
			dateFormat(date) {
				return dateShow(date)
			}
		},
		onLoad() {
			let that = this
			queryNoticeListApi(this.query.page, this.query.size).then(res => {
				this.noticeList = res.pageData
			})
		},
		onReachBottom() {
			if (this.loadmore) {
				this.query.page += 1;
				this.status = 'loading'
				queryNoticeListApi(this.query.page, this.query.size).then(res => {
					let list = res.pageData
					if (list.length !== 0) {
						this.noticeList.push(...list)
					} else {
						this.loadmore = false
					}
					this.status = 'nomore'
				}).catch(e => {
					this.status = 'nomore'
				})
			}
		},
		onPullDownRefresh() {
			this.query.page = 1
			this.loadmore = true
			queryNoticeListApi(this.query.page, this.query.size).then(res => {
				this.noticeList = res.pageData
				uni.stopPullDownRefresh()
			})
		},
		methods: {
			handleNoticeClick(item) {
				this.message = item.content
				this.showTipModal = true
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
	
	.box-shadow {
		border-radius: 15rpx;
		box-shadow: 0rpx 0rpx 50rpx 0rpx rgba(0, 0, 0, 0.07);
		// position: relative;
	}
	
	.tn-tabbar-height {
		min-height: 120rpx;
		height: calc(140rpx + env(safe-area-inset-bottom) / 2);
		height: calc(140rpx + constant(safe-area-inset-bottom));
	}
	
</style>