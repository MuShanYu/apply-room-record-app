<template>
	<view>
		<!-- 顶部自定义导航 -->
		<tn-nav-bar>自定义导航栏</tn-nav-bar>
		<!-- 页面内容 -->
		<view :style="{paddingTop: vuex_custom_bar_height + 'px'}">
			<tn-button @click='test()' backgroundColor="#01BEFF" :plain="false">
				点击进行登录
			</tn-button>
			<view class="">
				<tn-button @click='test1()' backgroundColor="#01BEFF" :plain="false">
					测试
				</tn-button>
			</view>
		</view>

	</view>
</template>

<script>
	import recordApi from '@/api/record.js'
	export default {
		data() {
			return {

			}
		},
		methods: {
			test() {
				this.$Router.push('/pages/public/login')
			},
			test1() {
				recordApi.userAccessRecordListApi(1, 20)
				.then(res => {
					console.log(res);
				})
				.catch(e => {
					console.log(e);
				})
			}
		}
	}
</script>

<style>

</style>