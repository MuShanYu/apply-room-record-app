<template>
	<view>
		<tn-nav-bar fixed customBack backgroundColor="#FFFFFF" :bottomShadow="false">
			<view slot="back" class='tn-custom-nav-bar__back' @click="goBack">
				<text class='icon tn-icon-left'></text>
			</view>
			<view slot="default" class="">
				版本更新
			</view>
		</tn-nav-bar>

		<view class="" :style="{marginTop: vuex_custom_bar_height + 'px'}">
			<view class="tn-margin-top tn-text-center">
				{{version}}
			</view>
		</view>
	</view>
</template>

<script>
	import {
		querySysConfigByKeyApi
	} from '@/api/config.js'
	export default {
		data() {
			return {
				version: ''
			}
		},
		onLoad() {
			querySysConfigByKeyApi('versionInfo').then(res => {
				console.log(res);
				this.version = JSON.parse(res.configValue).versionCode
			})
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
</style>