<template>
	<view>
		<!-- 顶部自定义导航 -->
		<tn-nav-bar :isBack='false'>首页</tn-nav-bar>
		<!-- 页面内容 -->
		<view :style="{paddingTop: vuex_custom_bar_height + 'px'}">
			
		</view>
		
		<view class='tn-tabbar-height'></view>
		<view class="bg-tabbar-shadow"></view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				
			}
		},
		methods: {
			
		}
	}
</script>

<style lang="scss" scoped>
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
</style>