<template>
  <view class="mask" :class= "mask == 'true' || mask == true ? 'mask-show' : ''" @click="Mclose" v-if="show" @touchmove.stop.prevent="preventTouchMove">
		<!-- 加载动画开始 -->    <!-- loading1~loading30挑选任意一个替换下方html 且替换对应css -->
    <view class="container">
      <view class="loading">
        <view class="squareXS"></view>
        <view class="squareXL"></view>
      </view>
    </view>
		<!-- 加载动画结束 -->
		<view class="title">{{text}}</view>
  </view>
  <!-- 遮罩层-->
</template>

<script scoped="true">
export default {
  name: "w-loading",
	props:{
		text: String,
		mask: Boolean | String,
		click: Boolean | String,
	},
  data() {
    return {
			show: false
		};
  },
	methods:{
		preventTouchMove(){
			return;
		},
		Mclose(){
			if(this.click == 'false' || this.click == false){
				this.show = false
			}
		},
		open(){
			this.show = true
    },
    close(){
      this.show = false
    }
	}
};
</script>

<style>
.mask {
  /* pointer-events: none; */
  position: fixed;
  z-index: 99999;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  height: 100vh;
  width: 100vw;
  display: flex;
	flex-direction:column;
  justify-content: center;
  align-items: center;
	flex-wrap: wrap;
}
.mask.mask-show{
	background: rgba(7, 17, 27, .3);
}
.title{
	color: #fff;
	font-size: 28upx;
}





/* loading加载动画的css */
.container {
  height: 280upx;
  width: 200upx;
}

.loading {
  position: absolute;
  top: 50%;
  left: 50%;
  height: 240upx;
  width: 160upx;
  margin: -120upx 0 0 -80upx;
}
.loading:after {
  content: "";
  position: absolute;
  bottom: -5upx;
  left: -5%;
  width: 110%;
  height: 10upx;
  border-radius: 100%;
  background: #ececec;
  z-index: -1;
  animation: shadow 1.8s linear infinite;
}
.squareXS {
  position: absolute;
  bottom: 30upx;
  left: 68upx;
  width: 24upx;
  height: 24upx;
  border-radius: 2upx;
  transform: scale(1.5, 0.5) rotate(0);
  background: #42a7fc;
  animation: squareXS 1.8s linear infinite;
}
.squareXL {
  position: absolute;
  bottom: -20upx;
  left: 44upx;
  width: 72upx;
  height: 72upx;
  border-radius: 2upx;
  transform: scale(2, 0.5) rotate(0);
  background: #fc3e42;
  animation: squareXL 1.8s linear infinite;
}
@-moz-keyframes squareXS {
  0% {
    transform: scale(1.5, 0.5) rotate(0);
  }
  10% {
    transform: scale(1, 1) rotate(0);
  }
  42% {
    transform: scale(1, 1) rotate(-180deg);
    bottom: 250upx;
  }
  74% {
    transform: scale(1, 1) rotate(-360deg);
  }
  75% {
    transform: scale(1, 1) rotate(-360deg);
    bottom: 74upx;
  }
  95% {
    transform: scale(1.5, 0.5) rotate(-360deg);
    bottom: 23upx;
  }
  100% {
    transform: scale(1.5, 0.5) rotate(-360deg);
    bottom: 14upx;
  }
}
@-webkit-keyframes squareXS {
  0% {
    transform: scale(1.5, 0.5) rotate(0);
  }
  10% {
    transform: scale(1, 1) rotate(0);
  }
  42% {
    transform: scale(1, 1) rotate(-180deg);
    bottom: 250upx;
  }
  74% {
    transform: scale(1, 1) rotate(-360deg);
  }
  75% {
    transform: scale(1, 1) rotate(-360deg);
    bottom: 74upx;
  }
  95% {
    transform: scale(1.5, 0.5) rotate(-360deg);
    bottom: 23upx;
  }
  100% {
    transform: scale(1.5, 0.5) rotate(-360deg);
    bottom: 14upx;
  }
}
@-o-keyframes squareXS {
  0% {
    transform: scale(1.5, 0.5) rotate(0);
  }
  10% {
    transform: scale(1, 1) rotate(0);
  }
  42% {
    transform: scale(1, 1) rotate(-180deg);
    bottom: 250upx;
  }
  74% {
    transform: scale(1, 1) rotate(-360deg);
  }
  75% {
    transform: scale(1, 1) rotate(-360deg);
    bottom: 74upx;
  }
  95% {
    transform: scale(1.5, 0.5) rotate(-360deg);
    bottom: 23upx;
  }
  100% {
    transform: scale(1.5, 0.5) rotate(-360deg);
    bottom: 14upx;
  }
}
@keyframes squareXS {
  0% {
    transform: scale(1.5, 0.5) rotate(0);
  }
  10% {
    transform: scale(1, 1) rotate(0);
  }
  42% {
    transform: scale(1, 1) rotate(-180deg);
    bottom: 250upx;
  }
  74% {
    transform: scale(1, 1) rotate(-360deg);
  }
  75% {
    transform: scale(1, 1) rotate(-360deg);
    bottom: 74upx;
  }
  95% {
    transform: scale(1.5, 0.5) rotate(-360deg);
    bottom: 23upx;
  }
  100% {
    transform: scale(1.5, 0.5) rotate(-360deg);
    bottom: 14upx;
  }
}
@-moz-keyframes squareXL {
  0% {
    transform: scale(2, 0.5) rotate(0);
  }
  10% {
    transform: scale(1, 1) rotate(0);
  }
  42% {
    transform: scale(1, 1) rotate(90deg);
    bottom: 120upx;
  }
  74% {
    transform: scale(1, 1) rotate(180deg);
  }
  75% {
    transform: scale(1, 1) rotate(180deg);
    bottom: 0;
  }
  95% {
    transform: scale(2, 0.5) rotate(180deg);
    bottom: -20upx;
  }
  100% {
    transform: scale(2, 0.5) rotate(180deg);
  }
}
@-webkit-keyframes squareXL {
  0% {
    transform: scale(2, 0.5) rotate(0);
  }
  10% {
    transform: scale(1, 1) rotate(0);
  }
  42% {
    transform: scale(1, 1) rotate(90deg);
    bottom: 120upx;
  }
  74% {
    transform: scale(1, 1) rotate(180deg);
  }
  75% {
    transform: scale(1, 1) rotate(180deg);
    bottom: 0;
  }
  95% {
    transform: scale(2, 0.5) rotate(180deg);
    bottom: -20upx;
  }
  100% {
    transform: scale(2, 0.5) rotate(180deg);
  }
}
@-o-keyframes squareXL {
  0% {
    transform: scale(2, 0.5) rotate(0);
  }
  10% {
    transform: scale(1, 1) rotate(0);
  }
  42% {
    transform: scale(1, 1) rotate(90deg);
    bottom: 120upx;
  }
  74% {
    transform: scale(1, 1) rotate(180deg);
  }
  75% {
    transform: scale(1, 1) rotate(180deg);
    bottom: 0;
  }
  95% {
    transform: scale(2, 0.5) rotate(180deg);
    bottom: -20upx;
  }
  100% {
    transform: scale(2, 0.5) rotate(180deg);
  }
}
@keyframes squareXL {
  0% {
    transform: scale(2, 0.5) rotate(0);
  }
  10% {
    transform: scale(1, 1) rotate(0);
  }
  42% {
    transform: scale(1, 1) rotate(90deg);
    bottom: 120upx;
  }
  74% {
    transform: scale(1, 1) rotate(180deg);
  }
  75% {
    transform: scale(1, 1) rotate(180deg);
    bottom: 0;
  }
  95% {
    transform: scale(2, 0.5) rotate(180deg);
    bottom: -20upx;
  }
  100% {
    transform: scale(2, 0.5) rotate(180deg);
  }
}
@-moz-keyframes shadow {
  40% {
    transform: scale(0.5, 0.8);
  }
}
@-webkit-keyframes shadow {
  40% {
    transform: scale(0.5, 0.8);
  }
}
@-o-keyframes shadow {
  40% {
    transform: scale(0.5, 0.8);
  }
}
@keyframes shadow {
  40% {
    transform: scale(0.5, 0.8);
  }
}
</style>
