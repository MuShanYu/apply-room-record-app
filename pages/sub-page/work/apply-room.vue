<template>
	<view>
		<tn-nav-bar fixed customBack backgroundColor="#FFFFFF" :bottomShadow="false">
			<view slot="back" class='tn-custom-nav-bar__back' @click="goBack">
				<text class='icon tn-icon-left'></text>
			</view>
			<view slot="default" class="">
				房间预约
			</view>
		</tn-nav-bar>

		<view style="" class="tn-bg-white tabs-fixed" :style="{marginTop: vuex_custom_bar_height + 'px'}">
			<view class="tn-padding-sm">
				<view class="tn-flex tn-flex-row-between">
					<view class="tn-text-left" @click="showSchools = true">
						<view class="">
							校区 <text class="tn-icon-down tn-margin-left-xs"></text>
						</view>
						<view class="tn-color-gray tn-margin-top-xs">
							{{query.school === '' ? '任意' : query.school}}
						</view>
					</view>
					<view class="tn-text-center" @click="showTeachBuildings = true">
						<view class="">
							楼栋 <text class="tn-icon-down tn-margin-left-xs"></text>
						</view>
						<view class="tn-color-gray tn-margin-top-xs">
							{{query.teachBuilding === '' ? '任意' : query.teachBuilding}}
						</view>
					</view>
					<view class="tn-text-right" @click="showCategories = true">
						<view class="">
							类别 <text class="tn-icon-down tn-margin-left-xs"></text>
						</view>
						<view class="tn-color-gray tn-margin-top-xs">
							{{query.category === '' ? '任意' : query.category}}
						</view>
					</view>
				</view>
			</view>
			<view class="tn-padding-left-sm tn-padding-right-sm">
				<view class="tn-flex tn-flex-row-between">
					<view class="" @click="showStartTime = true">
						<view class="">
							预约起始时间 <text class="tn-icon-down tn-margin-left-xs"></text>
						</view>
						<view class="tn-color-gray tn-margin-top-xs">
							{{query.startTime | dataFormat}}
						</view>
					</view>
					<view class="" @click="showEndTime = true">
						<view class="">
							预约结束时间 <text class="tn-icon-down tn-margin-left-xs"></text>
						</view>
						<view class="tn-color-gray tn-margin-top-xs">
							{{query.endTime | dataFormat}}
						</view>
					</view>
				</view>
			</view>
		</view>
		<view class="tn-padding" :style="{marginTop: (vuex_custom_bar_height + optionHeight) + 'px'}">
			<view class="tn-padding tn-margin-bottom tn-bg-white box-shadow" v-for="(item, index) in 20" :key="index">
				akdfjlsajfla
			</view>
		</view>

		<tn-picker mode="time" v-model="showStartTime" :params="params" :showTimeTag="true"></tn-picker>
		<tn-picker mode="time" v-model="showEndTime" :params="params" :showTimeTag="true"></tn-picker>
		<tn-picker mode="selector" v-model="showSchools" :defaultSelector="[0]" :range="schools"></tn-picker>
		<tn-picker mode="selector" v-model="showTeachBuildings" :defaultSelector="[0]" :range="teachBuildings"></tn-picker>
		<tn-picker mode="selector" v-model="showCategories" :defaultSelector="[0]" :range="categories"></tn-picker>
		<!-- <view class="">
			<view class="icon15__item--icon tn-flex tn-flex-row-center tn-flex-col-center tn-shadow-blur button-2"
				@tap.stop="handleBtnClick">
				<view class="tn-color-white">筛</view>
			</view>
		</view> -->


	</view>
</template>

<script>
	import {
		getRoomClassifyInfo
	} from '@/api/data-statistics.js'

	import {
		dateShow
	} from '@/utils/index.js'
	export default {
		data() {
			return {
				params: {
					year: true,
					month: true,
					day: true,
					hour: true,
					minute: true,
					timestamp: true
				},
				optionHeight: 0,
				showStartTime: false,
				showEndTime: false,
				showSchools: false,
				showTeachBuildings: false,
				showCategories: false,
				startTimeStr: 'start',
				endTimeStr: 'end',
				showFilterPopup: false,
				schools: ['任意'],
				teachBuildings: ['任意'],
				categories: ['任意'],
				query: {
					page: 1,
					size: 10,
					startTime: Number(new Date()),
					endTime: Number(new Date()) + 3600000,
					school: '',
					category: '',
					teachBuilding: ''
				}
			}
		},
		filters: {
			dataFormat(date) {
				return dateShow(date)
			}
		},
		mounted() {
			this.$nextTick(() => {
				const query = uni.createSelectorQuery().in(this)
				query.select('.tabs-fixed').boundingClientRect(data => {
					this.optionHeight = Math.ceil(data.height)
					// console.log(this.headerHeight);
				})
				query.exec()
			})
		},
		onLoad() {
			getRoomClassifyInfo().then(res => {
				this.schools.push(...res.schools)
				this.teachBuildings.push(...res.teachBuildings)
				this.categories.push(...res.categories)
			})
		},
		methods: {
			handleBtnClick() {
				this.showFilterPopup = true
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

	.button-2 {
		background-color: rgba(0, 0, 0, 0.15);
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