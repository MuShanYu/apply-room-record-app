<template>
	<view class="pages-a">
		<view class="" style="position: sticky;top: 0;">
			<!-- 顶部自定义导航 -->
			<tn-nav-bar fixed :isBack="false" :bottomShadow="false" backgroundColor="#FFFFFF">
				<view class="custom-nav tn-flex tn-flex-col-center tn-flex-row-left">
					<!-- 图标logo -->
					<view class="custom-nav__back" @click="tn('/pageA/about/about')">
						<view class="logo-pic png-sussuspension1"
							style="background-image:url('https://mushanyu-app-arr.oss-cn-beijing.aliyuncs.com/static/logo.png')">
							<view class="logo-image ">
							</view>
						</view>
					</view>
					<!-- notice bar -->
					<view class="custom-nav__search tn-flex tn-flex-col-center tn-flex-row-center"
						@click="tn('/pageA/search/search')">
						<view class="custom-nav__search__box tn-flex tn-flex-col-center tn-flex-row-left"
							style="background-color: rgba(230,230,230,0.3);">
			
							<view class="tn-color-gray" style="width: 100%;">
								<tn-notice-bar :list="list" mode="vertical" :duration="5000" rightIconName="notice" :leftIcon="false"
									:rightIcon="true"></tn-notice-bar>
							</view>
						</view>
					</view>
				</view>
			</tn-nav-bar> 
			<!-- tabs -->
			<view class="tabs-fixed tn-bg-white">
				<view class="tn-flex tn-flex-col-between tn-flex-col-center tn-padding-top-sm"
					:style="{marginTop: vuex_custom_bar_height + 'px'}">
					<view class="justify-content-item" style="width: 87vw;overflow: hidden;">
						<tn-tabs :list="scrollList" :current="current" :isScroll="false" activeColor="#000" :bold="true"
							:fontSize="32" :badgeOffset="[20, 50]" @change="tabChange" backgroundColor="#FFFFFF" :height="70"></tn-tabs>
					</view>
				</view>
			</view>
		</view>
		
		<!-- 页面内容 -->
		<view :style="{paddingTop: (vuex_custom_bar_height * 2) + 'px'}" class="tn-padding">
			<view class="article-shadow tn-bg-white tn-padding tn-margin-bottom" v-for="item in messageList" :key="item.id">
				<view class="tn-text-bold">
					{{item.content}}
				</view>
				<view class="tn-flex tn-flex-row-between tn-text-sm tn-color-gray tn-margin-top">
					<view class="">
						申请时间：{{item.createTime}}
					</view>
					<view class="">
						申请人：{{item.senderUserName}}
					</view>
				</view>
			</view>
			<tn-load-more :fontSize="20" status='nomore'></tn-load-more>
			<!-- <tn-empty text="登陆后查看" mode="permission"></tn-empty> -->
		</view>


		<view class='tn-tabbar-height'></view>
		<view class="bg-tabbar-shadow"></view>
	</view>
</template>

<script>
	import {
		queryNoticeListApi
	} from '@/api/notice.js'
	import {
		queryMyMessageListApi
	} from '@/api/message.js'
	export default {
		data() {
			return {
				show: true,
				current: 0,
				scrollList: [{
						name: '待办通知'
					},
					{
						name: '申请结果通知'
					}
				],
				list: [],
				query: {
					page: 1,
					size: 3
				},
				messageQuery: {
					page: 1,
					size: 10
				},
				messageList: [],
				loadmore: true,
				options2: [{
						text: '置顶',
						style: {
							backgroundColor: '#FFA726'
						}
					},
					{
						text: '删除',
						style: {
							backgroundColor: '#E83A30'
						}
					}
				],
			}
		},
		mounted() {
			queryNoticeListApi(this.query).then(res => {
				let resList = res.pageData
				resList.forEach(item => {
					this.list.push(item.title)
				})
			}).catch(e => {
				// console.log(e);
			})
			queryMyMessageListApi(this.messageQuery.page, this.messageQuery.size).then(res => {
				let list = res.pageData
				console.log(list);
				this.messageList = list
			}).catch(e => {
				// console.log(e);
			})
		},
		methods: {
			tabChange(index) {
				this.current = index
			},
			reachBottom() {
				if (this.loadmore) {
					console.log('bbbbb');
					this.messageQuery.page += 1
					queryMyMessageListApi(this.messageQuery.page, this.messageQuery.size).then(res => {
						let list = res.pageData
						if (list.length !== 0) {
							this.messageList.push(...list)
						} else {
							this.loadmore = false
						}
					}).catch(e => {
						// console.log(e);
						this.loadmore = false
					})
				}
				
			},
			
		}
	}
</script>

<style lang="scss" scoped>
	.pages-a {
		width: 100%;
		height: 100%;
		position: relative;
		// background-image: linear-gradient(to top, #4C3FAE 20%, #6E26BA 80%);
	}

	/* 底部安全边距 start*/
	.tn-tabbar-height {
		min-height: 120rpx;
		height: calc(140rpx + env(safe-area-inset-bottom) / 2);
		height: calc(140rpx + constant(safe-area-inset-bottom));
	}

	/* 底部tabbar假阴影 start*/
	.bg-tabbar-shadow {
		// background-image: repeating-linear-gradient(to top, rgba(0,0,0,0.1) 10rpx, rgba(255,255,255,0) , rgba(255,255,255,0));
		box-shadow: 0rpx 0rpx 400rpx 0rpx rgba(0, 0, 0, 0.25);
		position: fixed;
		bottom: calc(0rpx + env(safe-area-inset-bottom) / 2);
		bottom: calc(0rpx + constant(safe-area-inset-bottom));
		height: 60rpx;
		width: 100vw;
		z-index: 0;
	}

	.tabs-fixed {
		position: fixed;
		top: 0;
		width: 100%;
		transition: all 0.25s ease-out;
		z-index: 1;
	}

	/* 自定义导航栏内容 start */
	.custom-nav {
		height: 100%;

		&__back {
			margin: auto 5rpx;
			font-size: 40rpx;
			margin-right: 10rpx;
			margin-left: 30rpx;
			flex-basis: 5%;
		}

		&__search {
			flex-basis: 60%;
			width: 100%;
			height: 100%;

			&__box {
				width: 100%;
				height: 70%;
				padding: 10rpx 0;
				margin: 0 30rpx;
				border-radius: 60rpx 60rpx 0 60rpx;
				font-size: 24rpx;
			}

			&__icon {
				padding-right: 10rpx;
				margin-left: 20rpx;
				font-size: 30rpx;
			}

			&__text {
				// color: #AAAAAA;
			}
		}
	}

	.logo-image {
		z-index: 9999 !important;
		width: 65rpx;
		height: 65rpx;
		position: relative;
	}

	.logo-pic {
		z-index: 9999 !important;
		background-size: cover;
		background-repeat: no-repeat;
		// background-attachment:fixed;
		background-position: top;
		border-radius: 50%;
	}

	/* 旋转 */
	.png-sussuspension1 {
		animation: suspension1 12s ease-in-out infinite;
	}

	@keyframes suspension1 {
		0% {
			transform: rotate(0deg);
		}

		100% {
			transform: rotate(360deg);
		}
	}

	.article-shadow {
		border-radius: 15rpx;
		box-shadow: 0rpx 0rpx 50rpx 0rpx rgba(0, 0, 0, 0.07);
	}
</style>