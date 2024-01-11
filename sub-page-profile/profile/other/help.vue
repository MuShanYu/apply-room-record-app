<template>
	<view>
		<tn-nav-bar fixed customBack backgroundColor="#FFFFFF" :bottomShadow="false">
			<view slot="back" class='tn-custom-nav-bar__back' @click="goBack">
				<text class='icon tn-icon-left'></text>
			</view>
			<view slot="default" class="">
				帮助中心
			</view>
		</tn-nav-bar>

		<view class="" :style="{marginTop: vuex_custom_bar_height + 'px'}">
			<view class="tn-bg-white">
				<view class="tn-text-bold tn-margin-bottom" style="padding-left: 20rpx;font-size: 30rpx;">
					常见问题
				</view>
				<view class="">
					<tn-collapse :headStyle="{paddingTop: '36rpx;', fontSize: '28rpx;'}" :bodyStyle="{fontSize: '26rpx;'}">
						<tn-collapse-item v-for="(item, index) in list" :key="index" :title="item.title" :disabled="item.disabled">
							<view class="collapse-item-content">
								{{ item.content }}
							</view>
						</tn-collapse-item>
					</tn-collapse>
				</view>
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
				list: []
			}
		},
		onLoad() {
			querySysConfigByKeyApi('helpInfo').then(res => {
				console.log(res);
				this.list = JSON.parse(res.configValue).list
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

	.collapse-item-content {
		word-wrap: break-word;
	}
</style>