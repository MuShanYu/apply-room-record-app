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

		<view class="tn-bg-white tabs-fixed box-shadow" :style="{marginTop: vuex_custom_bar_height + 'px'}">
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
			<view class="tn-padding-left-sm tn-padding-right-sm tn-padding-bottom-xs">
				<view class="tn-flex tn-flex-row-between">
					<view class="" @click="showStartTime = true">
						<view class="">
							预约起始时间 <text class="tn-icon-down tn-margin-left-xs"></text>
						</view>
						<view class="tn-color-gray tn-margin-top-xs">
							{{query.startTime | dateFormat}}
						</view>
					</view>
					<view class="" @click="showEndTime = true">
						<view class="">
							预约结束时间 <text class="tn-icon-down tn-margin-left-xs"></text>
						</view>
						<view class="tn-color-gray tn-margin-top-xs">
							{{query.endTime | dateFormat}}
						</view>
					</view>
				</view>
			</view>
		</view>
		<view class="tn-padding" :style="{marginTop: (vuex_custom_bar_height + optionHeight) + 'px'}">
			<view @click="tn(item)" style="position: relative;" class="tn-padding tn-margin-bottom tn-bg-white box-shadow"
				v-for="(item, index) in roomList" :key="item.id">
				<view class="tn-text-lg tn-text-bold">
					{{item.roomName}}
				</view>
				<view class="tn-color-gray tn-margin-top-xs tn-margin-bottom">
					可容纳{{item.capacity}}人，拥有{{item.equipmentInfo}}等。
				</view>
				<view class="tn-flex tn-flex-row-between tn-color-gray tn-text-df">
					<view class="">
						<text class="tn-icon-company tn-text-xl" style="padding-right: 8rpx;"></text> {{item.school}}
					</view>
					<view class="">
						<text class="tn-icon-map tn-text-xl" style="padding-right: 8rpx;"></text> {{item.teachBuilding}}
					</view>
					<view class="">
						<text class="tn-icon-menu tn-text-xl" style="padding-right: 8rpx;"></text> {{item.category}}
					</view>
				</view>
			</view>
			<tn-load-more :status='status'></tn-load-more>
		</view>

		<tn-picker title="选择校区" mode="selector" v-model="showSchools" :defaultSelector="[0]" :range="schools"
			@confirm="handleOptionClick($event, 0)"></tn-picker>
		<tn-picker title="选择楼栋" mode="selector" v-model="showTeachBuildings" :defaultSelector="[0]"
			@confirm="handleOptionClick($event, 1)" :range="teachBuildings"></tn-picker>
		<tn-picker title="选择房间类别" mode="selector" v-model="showCategories" :defaultSelector="[0]"
			@confirm="handleOptionClick($event, 2)" :range="categories"></tn-picker>
		<tn-picker title="选择预约起始时间" mode="time" v-model="showStartTime" :params="params" :showTimeTag="true"
			@confirm="handleOptionClick($event, 3)"></tn-picker>
		<tn-picker title="选择预约结束时间" mode="time" v-model="showEndTime" :params="params" :showTimeTag="true"
			@confirm="handleOptionClick($event, 4)"></tn-picker>

		<w-loading text="拼命处理中..." mask="true" click="true" ref="loading"></w-loading>


	</view>
</template>

<script>
	import {
		getRoomClassifyInfo
	} from '@/api/data-statistics.js'
	import {
		reservationRoomList
	} from '@/api/room.js'
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
				},
				roomList: [],
				status: 'nomore',
				loadmore: true
			}
		},
		filters: {
			dateFormat(date) {
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
			this.getRoomReserveList()
		},
		onReachBottom() {
			if (this.loadmore) {
				this.query.page += 1
				this.status = 'loading'
				reservationRoomList(this.query).then(res => {
					let list = res.pageData
					if (list.length !== 0) {
						this.roomList.push(...list)
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
			tn(item) {
				let that = this
				this.$Router.push({
					path: '/pages/sub-page/work/apply-room-detail',
					query: {
						id: item.id,
						name: item.chargePerson,
						startTime: that.query.startTime,
						endTime: that.query.endTime,
						roomName: item.roomName,
						equipmentInfo: item.equipmentInfo
					}
				})
			},
			getRoomReserveList() {
				this.$refs.loading.open()
				reservationRoomList(this.query).then(res => {
					console.log(res);
					this.roomList = res.pageData
					this.$refs.loading.close()
				}).catch(e => {
					console.log(e);
					this.$refs.loading.close()
				})
			},
			refreshData() {
				this.query.page = 1;
				this.loadmore = true
				// 返回顶部
				uni.pageScrollTo({
					scrollTop: 0,
					duration: 0
				})
				// 查询
				// 开始加载新数据
				this.getRoomReserveList()
			},
			handleOptionClick(e, index) {
				console.log(e);
				console.log(index);
				let that = this
				switch (index) {
					case 0:
						that.query.school = that.schools[e[0]]
						console.log(that.query.school)
						break
					case 1:
						that.query.teachBuilding = that.teachBuildings[e[0]]
						break
					case 2:
						that.query.category = that.categories[e[0]]
						break
					case 3:
						// 起始时间
						//毫秒
						that.query.startTime = e.timestamp * 1000
						break
					case 4:
						// 结束时间
						that.query.endTime = e.timestamp * 1000
						break
				}
				this.refreshData()
			}
		}
	}
</script>

<style lang="scss" scoped>
	.image-pic {
		border: 1rpx solid #F8F7F8;
		background-size: cover;
		background-repeat: no-repeat;
		// background-attachment:fixed;
		background-position: top;
		border-radius: 10rpx;
	}

	.image-article {
		border-radius: 8rpx;
		width: 200rpx;
		height: 200rpx;
		position: relative;
	}

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