<template>
	<view>
		<tn-nav-bar fixed customBack backgroundColor="#FFFFFF" :bottomShadow="false">
			<view slot="back" class='tn-custom-nav-bar__back' @click="goBack">
				<text class='icon tn-icon-left'></text>
			</view>
			<view slot="default" class="">
				补卡申请
			</view>
		</tn-nav-bar>

		<view class="tn-bg-white notice tabs-fixed" :style="{marginTop: vuex_custom_bar_height + 'px'}">
			<tn-notice-bar :fontSize="24" :show="noticeShow" :list="list" :closeBtn="true"
				@close="handleNoticeClose"></tn-notice-bar>
		</view>

		<view class="tn-padding"
			:style="{marginTop: noticeShow ? (noticeHeight + vuex_custom_bar_height) + 'px' : vuex_custom_bar_height + 'px'}">
			<view class="">
				<view @click="tn(item)" class="tn-bg-white box-shadow tn-padding tn-margin-bottom"
					v-for="item in accessReocrdList" :key="item.id">
					<view class="tn-flex tn-flex-row-between">
						<view class="tn-text-bold tn-text-ellipsis tn-text-md">
							{{item.entryTime | dateFormat2}}-{{item.roomName}}
						</view>
					</view>
					<!-- tag -->
					<view class="" style="position: absolute;top: 0;right: 0;">
						<view class=""
							style="border-top-right-radius: 15rpx;padding: 8rpx;font-size: 18rpx;background-color: #0081ff;color: #FFFFFF;">
							待处理
						</view>
					</view>
					<view class="tn-margin-top-sm tn-color-gray" style="font-size: 26rpx;">
						该房间于{{item.entryTime | dateFormat}}进入，未进行签退。
					</view>
					<view class="tn-flex tn-flex-row-between tn-color-gray tn-text-df tn-margin-top tn-text-sm">
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

		<w-loading text="拼命处理中..." mask="true" click="true" ref="loading"></w-loading>
		<tn-toast ref="toast"></tn-toast>

		<tn-modal :showCloseBtn="true" @click="showServiceErrorModal = false" v-model="showServiceErrorModal"
			:title="'系统提示'" :content="message" :button="serviceErrorModalButton">
		</tn-modal>

		<tn-popup mode="top" :marginTop="vuex_custom_bar_height" v-model="showPopup">
			<view class="tn-padding">
				<tn-form :model="query" ref="form" :borderBottom="false" :labelWidth="160">
					<tn-form-item label="房间名称" prop="roomName" :borderBottom="false">
						<tn-input placeholder="请输入要搜索的房间名称" v-model="query.roomName" />
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
		queryCanApplyAccessRecordListApi
	} from '@/api/record.js'

	import {
		querySysConfigByKeyApi
	} from '@/api/config.js'

	import {
		dateShow
	} from '@/utils/index.js'
	export default {
		data() {
			return {
				query: {
					page: 1,
					size: 10,
					roomName: ''
				},
				accessReocrdList: [],
				noticeShow: true,
				list: ['默认内容'],
				noticeHeight: 0,
				loadmore: true,
				showServiceErrorModal: false,
				message: '',
				serviceErrorModalButton: [{
					text: '我知道了',
					backgroundColor: '#3668FC',
					fontColor: '#FFFFFF',
				}],
				status: 'nomore',
				showPopup: false
			}
		},
		filters: {
			dateFormat(date) {
				return dateShow(date, 'yyyy年MM月dd日 hh:mm')
			},
			dateFormat2(date) {
				return dateShow(date, 'MM月dd日hh:mm')
			}
		},
		onLoad() {
			querySysConfigByKeyApi('signInNotice').then(res => {
				let content = JSON.parse(res.configValue).content
				this.list.splice(0, 1)
				this.list.push(content)
			})
			this.getDataList()

			// 监听申请事件
			uni.$on('signInApply', (data) => {
				let index = this.accessReocrdList.findIndex(item => item.id === data.accessRecordId)
				this.accessReocrdList.splice(index, 1)
			})
			this.noticeShow = uni.getStorageSync('signInApplyTip') === '' ? true : false
		},
		onPullDownRefresh() {
			this.query.page = 1
			this.loadmore = true
			queryCanApplyAccessRecordListApi(this.query).then(res => {
				this.accessReocrdList = res.pageData
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
				queryCanApplyAccessRecordListApi(this.query).then(res => {
					if (res.pageData.length > 0) {
						this.accessReocrdList.push(...res.pageData)
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
		mounted() {
			this.$nextTick(() => {
				const query = uni.createSelectorQuery().in(this)
				query.select('.notice').boundingClientRect(data => {
					this.noticeHeight = Math.ceil(data.height)
				})
				query.exec()
			})
		},
		methods: {
			getDataList() {
				this.$refs.loading.open()
				queryCanApplyAccessRecordListApi(this.query).then(res => {
					this.accessReocrdList = res.pageData
					this.$refs.loading.close()
					// console.log(this.accessReocrdList);
				}).catch(e => {
					console.log(e);
					this.$refs.close()
				})
			},
			tn(item) {
				this.$Router.push({
					path: '/page-work/sign-in-apply/sign-in-apply-detail',
					query: {
						accessRecordId: item.id,
						entryTime: item.entryTime,
						roomName: item.roomName,
						chargePersonId: item.chargePersonId
					}
				})
			},
			handleNoticeClose() {
				this.noticeShow = false
				this.$refs.toast.show({
					title: '下次登录前不再展示该提醒',
					duration: 2500
				})
				uni.setStorageSync('signInApplyTip', false)
			},
			handleClearQuery() {
				this.query.page = 1
				this.query.roomName = ''
				this.showPopup = false
				uni.pageScrollTo({
					scrollTop: 0,
					duration: 300
				})
				this.getDataList()
			},
			handleQueryFilterConfirm() {
				this.query.page = 1
				this.showPopup = false
				uni.pageScrollTo({
					scrollTop: 0,
					duration: 300
				})
				this.getDataList()
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

	.box-shadow {
		border-radius: 15rpx;
		box-shadow: 0rpx 0rpx 50rpx 0rpx rgba(0, 0, 0, 0.07);
		position: relative;
	}

	.tabs-fixed {
		position: fixed;
		top: 0;
		width: 100%;
		transition: all 0.25s ease-out;
		z-index: 1;
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