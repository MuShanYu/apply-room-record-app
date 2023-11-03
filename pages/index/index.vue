<template>
	<view>
		<!-- 二级页面 -->
		<view v-if="tabberPageLoadFlag[0]" :style="{
		    display: currentTabbarIndex === 0 ? '' : 'none'
		  }">
			<scroll-view class="custom-tabbar-page" scroll-y enable-back-to-top @scrolltolower="tabbarPageScrollLower">
				<home ref="home"></home>
			</scroll-view>
		</view>

		<view v-if="tabberPageLoadFlag[1]" :style="{
		    display: currentTabbarIndex === 1 ? '' : 'none'
		  }">
			<scroll-view class="custom-tabbar-page" scroll-y enable-back-to-top @scrolltolower="tabbarPageScrollLower">
				<work ref="work"></work>
			</scroll-view>
		</view>

		<view v-if="tabberPageLoadFlag[2]" :style="{
		    display: currentTabbarIndex === 2 ? '' : 'none'
		  }">
			<scroll-view class="custom-tabbar-page" scroll-y enable-back-to-top @scrolltolower="tabbarPageScrollLower">
				<profile ref="profile"></profile>
			</scroll-view>
		</view>

		<!-- 冒泡特效 -->
		<view class="tabbar tn-bg-white">

			<div class="">
				<div class="g-bubble"></div>
				<div class="g-bubble"></div>
				<div class="g-bubble"></div>
				<div class="g-bubble"></div>
				<div class="g-bubble"></div>

				<div class="g-bubble"></div>
				<div class="g-bubble"></div>
				<div class="g-bubble"></div>
				<div class="g-bubble"></div>
				<div class="g-bubble"></div>

				<div class="g-bubble"></div>
				<div class="g-bubble"></div>
				<div class="g-bubble"></div>
				<div class="g-bubble"></div>
				<div class="g-bubble"></div>

				<div class="g-bubble"></div>
				<div class="g-bubble"></div>
				<div class="g-bubble"></div>
				<div class="g-bubble"></div>
				<div class="g-bubble"></div>
			</div>
		</view>
		<!-- 底部导航栏 -->
		<view class="action" @tap.stop="changeTabbar(0)">
			<view class="bar-icon">
				<image class="" :src="`/static/tabbar/tn-tabbar0${currentTabbarIndex === 0 ? '-curnew' : ''}.png`"></image>
			</view>
			<view class="" :class="[currentTabbarIndex === 0 ? 'tn-color-blue' : 'tn-color-gray']">首页</view>
		</view>

		<view class="action bar-center" @tap.stop="changeTabbar(1)">
			<view class="nav-index-button">
				<view class="nav-index-button__content">
					<view class="nav-index-button__content--icon tn-flex tn-flex-row-center tn-flex-col-center">
						<view class="bar-circle">
							<image class=""
								src='https://cdn.nlark.com/yuque/0/2021/png/280373/1634526816906-assets/web-upload/568740d8-8669-48d5-9b3e-b510e39d127d.png'>
							</image>
						</view>
					</view>
				</view>
				<!-- 特效 -->
				<view class="nav-index-button__meteor">
					<view class="nav-index-button__meteor__wrapper">
						<view v-for="(item,index) in 6" :key="index" class="nav-index-button__meteor__item"
							:style="{transform: `rotateX(${-60 + (30 * index)}deg) rotateZ(${-60 + (30 * index)}deg)`}">
							<view class="nav-index-button__meteor__item--pic"></view>
						</view>
					</view>
				</view>
			</view>
		</view>

		<view class="action" @tap.stop="changeTabbar(2)">
			<view class="bar-icon">
				<image class="" :src="`/static/tabbar/tn-tabbar3${currentTabbarIndex === 2 ? '-curnew' : ''}.png`"></image>
			</view>
			<view class="" :class="[currentTabbarIndex === 2 ? 'tn-color-blue' : 'tn-color-gray']">我的</view>
		</view>
	</view>

	<view class="tnwave waveAnimation">
		<view class="waveWrapperInner bgTop">
			<view class="wave waveTop" style="background-image: url('https://resource.tuniaokj.com/images/wave/wave-2.png')">
			</view>
		</view>
		<view class="waveWrapperInner bgMiddle">
			<view class="wave waveMiddle"
				style="background-image: url('https://resource.tuniaokj.com/images/wave/wave-2.png')"></view>
		</view>
		<view class="waveWrapperInner bgBottom">
			<view class="wave waveBottom"
				style="background-image: url('https://resource.tuniaokj.com/images/wave/wave-1.png')"></view>
		</view>
	</view>
</template>

<script>
	import Home from './component/home.vue'
	import Work from './component/work.vue'
	import Profile from './component/profile.vue'

	export default {
		data() {
			return {
				currentTabbarIndex: 0,

				// 自定义底栏对应页面的加载情况
				tabberPageLoadFlag: []
			}
		},
		components: {
			Home,
			Work,
			Profile
		},
		onLoad(options) {
			const index = Number(options.index || 0)
			// 根据底部tabbar菜单列表设置对应页面的加载情况
			for (let i = 0; i < 3; i++) {
				this.tabberPageLoadFlag.push(i === index)
			}
			this.changeTabbar(index)
		},
		methods: {
			// 导航页面滚动到底部
			tabbarPageScrollLower(e) {
				
			},

			// 修改当前选中的tabbar
			changeTabbar(index) {
				if (this.currentTabbarIndex === index) return
				this._switchTabbarPage(index)
				this.currentTabbarIndex = index
			},

			// 切换导航页面
			_switchTabbarPage(index) {
				// 底部tabbar短震动骚操作，真机效果很不错，模拟器忽略就行
				wx.vibrateShort();
				// 正式代码
				const selectPageFlag = this.tabberPageLoadFlag[index]
				if (selectPageFlag === undefined) {
					return
				}
				if (selectPageFlag === false) {
					this.tabberPageLoadFlag[index] = true
				}
			},
		}
	}
</script>

<style lang="scss" scoped>
/* 波浪*/
  .template-outset{
    // background-image: linear-gradient(to top, #4C3FAE 20%, #6E26BA 80%);
    width: 100vw;
    height: 100vh;
  }
  @keyframes move_wave {
      0% {
          transform: translateX(0) translateZ(0) scaleY(1)
      }
      50% {
          transform: translateX(-25%) translateZ(0) scaleY(1)
      }
      100% {
          transform: translateX(-50%) translateZ(0) scaleY(1)
      }
  }
  .tnwave {
      overflow: hidden;
      position: absolute;
      left: 0;
      right: 0;
      // bottom: 100rpx;
      bottom: calc(50rpx + constant(safe-area-inset-bottom));
      bottom: calc(50rpx + env(safe-area-inset-bottom));
      // top: 0;
      z-index: 997;
      margin: auto;
      height: 90rpx;
      // background-color: chartreuse;
  }
  .waveWrapperInner {
      position: absolute;
      width: 100%;
      overflow: hidden;
      height: 100%;
  }
  .wave {
      position: absolute;
      left: 0;
      width: 200%;
      height: 100%;
      background-repeat: repeat no-repeat;
      background-position: 0 bottom;
      transform-origin: center bottom;
  }
 
  
  .bgTop {
      opacity: 0.4;
  }
  .waveTop {
      background-size: 50% 45px;
  }
  .waveAnimation .waveTop {
    animation: move_wave 4s linear infinite;
  }
  
  .bgMiddle {
      opacity: 0.6;
  }
  .waveMiddle {
      background-size: 50% 40px;
  }
  .waveAnimation .waveMiddle {
      animation: move_wave 3.5s linear infinite;
  }
  
  .bgBottom {
      opacity: 0.95;
  }
  .waveBottom {
      background-size: 50% 35px;
  }
  .waveAnimation .waveBottom {
      animation: move_wave 2s linear infinite;
  }

  
  @for $i from 0 through 20 { 
      .g-bubble:nth-child(#{$i}) {
          opacity: 0.2;
          border-radius: 100%;
          position: fixed;
          background: #26b4f5;
          $width: random(20) + px;
          right: #{(random(100)) + '%'};
          bottom: - #{(random(60))}px;
          width: $width;
          height: $width;
          animation: moveToTop #{(random(9500) + 1500) / 1000}s ease-in-out -#{random(9000)/1000}s infinite;
      }
  }
  @keyframes moveToTop {
      70% {
          opacity: 0.05;
      }
      100% {
          opacity: 0.01;
          transform: translate(-50%, -180px) scale(0.3);
      }
  }
</style>