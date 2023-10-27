<template>
  <view class="template-login">
    <!-- 顶部自定义导航 -->
    <tn-nav-bar fixed alpha customBack>
      <view slot="back" class='tn-custom-nav-bar__back'
        @click="goBack">
        <text class='icon tn-icon-left'></text>
      </view>
    </tn-nav-bar>
    
    <view class="login login-fixed">

      <view class="login__wrapper">
        <view class="tn-margin-left tn-margin-right tn-text-bold" style="font-size: 48rpx;">
          房间预约与流动统计
        </view>
       <view class="tn-margin tn-color-gray--dark tn-text-sm">
          这是一句很厉害的App介绍！
        </view>
        
        <!-- 输入框内容-->
        <view class="login__info tn-flex tn-flex-direction-column tn-flex-col-center tn-flex-row-center">
          <!-- 注册 -->
          <block>
            <view class="login__info__item__input tn-flex tn-flex-direction-row tn-flex-nowrap tn-flex-col-center tn-flex-row-left">
              <view class="login__info__item__input__left-icon">
                <view class="tn-icon-identity"></view>
              </view>
              <view class="login__info__item__input__content">
                <input maxlength="16" placeholder-class="input-placeholder" placeholder="学号/工号" />
              </view>
            </view>
						
						<view class="login__info__item__input tn-flex tn-flex-direction-row tn-flex-nowrap tn-flex-col-center tn-flex-row-left">
						  <view class="login__info__item__input__left-icon">
						    <view class="tn-icon-my"></view>
						  </view>
						  <view class="login__info__item__input__content">
						    <input maxlength="16" placeholder-class="input-placeholder" placeholder="姓名" />
						  </view>
						</view>
            
            <view class="login__info__item__input tn-flex tn-flex-direction-row tn-flex-nowrap tn-flex-col-center tn-flex-row-left">
              <view class="login__info__item__input__left-icon">
                <view class="tn-icon-company"></view>
              </view>
              <view class="login__info__item__input__content">
								<tn-input @click="showPicker = true" type="select" placeholder="请选择您所在的学院" placeholder-class="input-placeholder"/>
              </view>
            </view>
            
						<view class="login__info__item__input tn-flex tn-flex-direction-row tn-flex-nowrap tn-flex-col-center tn-flex-row-left">
						  <view class="login__info__item__input__left-icon">
						    <view class="tn-icon-phone"></view>
						  </view>
						  <view class="login__info__item__input__content">
						    <input type="select" maxlength="16" placeholder-class="input-placeholder" placeholder="联系电话" />
						  </view>
						</view>
						
						<view class="login__info__item__input tn-flex tn-flex-direction-row tn-flex-nowrap tn-flex-col-center tn-flex-row-left">
						  <view class="login__info__item__input__left-icon">
						    <view class="tn-icon-email"></view>
						  </view>
						  <view class="login__info__item__input__content">
						    <input type="select" maxlength="16" placeholder-class="input-placeholder" placeholder="邮箱" />
						  </view>
						</view>
            
          </block>
          
          
          <!-- 悬浮按钮-->
          <view class="tn-margin-top-lg" style="width: 100%;position: relative;">
            <view class="tn-margin-top-lg">
              <tn-button backgroundColor="#3668FC" padding="40rpx 0" width="100%" :fontSize="28" fontColor="#FFFFFF" @click="tn('')">
                <text class="">注 册</text>
              </tn-button>
            </view>
          </view>
          
          <view class="login__info__item__tips">
            <view class="tn-flex tn-flex-row-between">
              <view class="tn-color-gray" @tap="goBack()">已有账号？前往登录</view>
            </view>
          </view>
          
        </view>
        
      </view>
      
    </view>
		
		<tn-picker mode="selector" v-model="showPicker"  :defaultSelector="[0]" :range="institutes"></tn-picker>
		
    
  </view>
</template>

<script>
  export default {
    name: 'login',
		onLoad() {
			// 更新顶部导航栏信息
			this.updateCustomBarInfo()
		},
    data() {
      return {
				showPicker: false,
				institutes: ['1', '2', '3']
      }
    },
    methods: {
      // 跳转
      tn(url) {
        this.$Router.push(url)
      },
			// 点击左上角返回按钮时触发事件
			goBack() {
			  // 通过判断当前页面的页面栈信息，是否有上一页进行返回，如果没有则跳转到首页
			 const pages = getCurrentPages()
			 if (pages && pages.length > 0) {
			   const firstPage = pages[0]
			   if (pages.length == 1 && (!firstPage.route || firstPage.route != 'pages/home/index')) {
			     this.$Router.pushTab('/pages/home/index')
			   } else {
			     this.$Router.back(1)
			   }
			 } else {
			   this.$Router.pushTab('/pages/home/index')
			 }
			},
			// 更新顶部导航栏信息
			async updateCustomBarInfo() {
			  // 获取vuex中的自定义顶栏的高度
			  let customBarHeight = this.vuex_custom_bar_height
			  let statusBarHeight = this.vuex_status_bar_height
			  // 如果获取失败则重新获取
			  if (!customBarHeight) {
			    try {
			      const navBarInfo = await this.$tn.updateCustomBar()
			      customBarHeight = navBarInfo.customBarHeight
			      statusBarHeight = navBarInfo.statusBarHeight
			    } catch(e) {
			      setTimeout(() => {
			        this.updateCustomBarInfo()
			      }, 10)
			      return
			    }
			  }
			  
			  // 更新vuex中的导航栏信息
			  this.$tn.vuex('vuex_status_bar_height', statusBarHeight)
			  this.$tn.vuex('vuex_custom_bar_height', customBarHeight)
			}
    }
  }
</script>

<style lang="scss" scoped>
  /* 胶囊*/
  .tn-custom-nav-bar__back {
    width: 100%;
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
  
  /* 悬浮 */
  /* .login-sussuspension{
    animation: suspension 3s ease-in-out infinite;
  }
  
  @keyframes suspension {
    0%, 100% {
      transform: translate(0 , 0);
    }
    50% {
      transform: translate(0rem , 1rem);
    }
  } */
  
  // 渐变底色
  .login-fixed{
    position: fixed;
    // background: linear-gradient(0deg, #F6DB4E00, #F6DB4EF2, #F6DB4E);
    background: linear-gradient(90deg, #FFFFFF, #FFFFFF, #DBF2FE, #DBF2FE);
    // background: linear-gradient(90deg, #FFFFFF, #FFFFFF, #FC3A7230, #FC3A7280);
    top: 0;
    width: 100%;
    transition: all 0.25s ease-out;
    z-index: 100;
    height: 400rpx;
  }
  .login-fixed:before{
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    z-index: -1;
    mask-image: linear-gradient(to bottom, transparent, black);
    background: linear-gradient(90deg, #FFFFFF, #FFFFFF);	
  
  }
  
  .login {
    position: relative;
    z-index: 1;
    
    /* 内容 start */
    &__wrapper {
      padding-top: 300rpx;
      width: 100%;
    }
    
    /* 切换 start */
    &__mode {
      position: relative;
      margin: 0 auto;
      width: 476rpx;
      height: 77rpx;
      margin-top: 100rpx;
      background-color: rgba(255,255,255,0.6);
      box-shadow: 0rpx 10rpx 50rpx 0rpx rgba(0, 3, 72, 0.1);
      border-radius: 39rpx;
      
      &__item {
        height: 77rpx;
        width: 100%;
        line-height: 77rpx;
        text-align: center;
        font-size: 31rpx;
        color: #080808;
        letter-spacing: 1em;
        text-indent: 1em;
        z-index: 2;
        transition: all 0.4s;
        
        &--active {
          font-weight: bold;
          color: #FFFFFF;
        }
      }
      
      &__slider {
        position: absolute;
        height: inherit;
        width: calc(476rpx / 2);
        border-radius: inherit;
        box-shadow: 0rpx 18rpx 72rpx 18rpx rgba(0, 195, 255, 0.1);
        z-index: 1;
        transition: all 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55);
      }
    }
    /* 切换 end */
    
    /* 登录注册信息 start */
    &__info {
      margin: 80rpx 30rpx 10rpx 30rpx;
      padding-bottom: 0;
      border-radius: 20rpx;
      
      &__item {
        
        &__input {
          margin-top: 59rpx;
          width: 100%;
          height: 77rpx;
          border-bottom: 1rpx solid #E6E6E6;
          
          &__left-icon {
            font-size: 44rpx;
            padding: 10rpx 0rpx 30rpx 0rpx;
            color: #AAAAAA;
          }
          
          &__content {
            width: 90%;
            padding: 10rpx 0rpx 30rpx 10rpx;
            // padding-left: 10rpx;
            
            &--verify-code {
              width: 90%;
            }
            
            input {
              font-size: 32rpx;
              // letter-spacing: 0.1em;
            }
          }
          
          &__right-icon {
            width: 10%;
            font-size: 44rpx;
            margin-right: 0rpx;
            color: #AAAAAA;
            padding: 10rpx 0rpx 30rpx 0rpx;
          }
          
          &__right-verify-code {
            width: 28%;
            padding: 10rpx 0rpx 30rpx 0rpx;
          }
        }
        
        &__tips {
          margin: 30rpx 0;
          color: #AAAAAA;
        }
      }
    }
    /* 登录注册信息 end */
    /* 内容 end */
    
  }
  
  .tn-three{
      position: absolute;
      top: 50%;
      right: 50%;
      bottom: 50%;
      left: 50%;
      transform: translate(-38rpx, -16rpx) rotateX(30deg) rotateY(20deg) rotateZ(-30deg);
      text-shadow: -1rpx 2rpx 0 #f0f0f0, -2rpx 4rpx 0 #f0f0f0, -10rpx 20rpx 30rpx rgba(0, 0, 0, 0.2);
  }
  
  
  /* 图标容器13 start */
  .icon13 {
    &__item {
      width: 30%;
      background-color: #FFFFFF;
      border-radius: 10rpx;
      padding: 30rpx;
      margin: 20rpx 10rpx;
      transform: scale(1);
      transition: transform 0.3s linear;
      transform-origin: center center;
      
      &--icon {
        width: 100rpx;
        height: 100rpx;
        font-size: 60rpx;
        border-radius: 50%;
        margin-bottom: 18rpx;
        position: relative;
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
          background-image: url(https://tnuiimage.tnkjapp.com/cool_bg_image/icon_bg.png);
  
            
        }
      }
    }
  }
  
  /* 底部悬浮按钮 start*/
  .tn-tabbar-height {
  	min-height: 160rpx;
  	height: calc(180rpx + env(safe-area-inset-bottom) / 2);
    height: calc(180rpx + constant(safe-area-inset-bottom));
  }
  .tn-footerfixed {
    position: fixed;
    width: 100%;
    bottom: calc(30rpx + env(safe-area-inset-bottom));
    z-index: 1024;
    box-shadow: 0 1rpx 6rpx rgba(0, 0, 0, 0);
    
  }
  /* 底部悬浮按钮 end*/
  
  /deep/.input-placeholder {
    font-size: 32rpx;
    color: #AAAAAA;
  }
  
</style>
