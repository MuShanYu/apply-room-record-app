<template>
	<view>
		<tn-nav-bar fixed customBack backgroundColor="#FFFFFF" :bottomShadow="false">
			<view slot="back" class='tn-custom-nav-bar__back' @click="goBack">
				<text class='icon tn-icon-left'></text>
			</view>
			<view slot="default" class="">
				预约审批驳回
			</view>
		</tn-nav-bar>

		<view class="" :style="{marginTop: optionHeight + 'px'}">
			
		</view>
	</view>
</template>

<script>
	import {
		passOrRejectReserveApi
	} from '@/api/room.js'
	
	export default {
		data() {
			return {
				reserveId: ''
			}
		},
		onLoad(param) {
			this.reserveId= param.reserveId
			console.log(this.reserveId);
		},
		methods: {
			
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
</style>