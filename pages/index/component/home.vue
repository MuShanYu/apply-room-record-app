<template>
	<view>
		<!-- 顶部自定义导航 -->
		<tn-nav-bar :isBack='false'>首页</tn-nav-bar>
		<!-- 页面内容 -->
		<view :style="{paddingTop: vuex_custom_bar_height + 'px'}">
			
		</view>
	</view>
</template>

<script>
	import recordApi from '@/api/record.js'
	export default {
		data() {
			return {
				title: 'aaaaa',
				show: true
			}
		},
		methods: {
			test() {
				this.show = !this.show
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