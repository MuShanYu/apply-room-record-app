<template>
  <view class="pages-a">
    <!-- 顶部自定义导航 -->
    <tn-nav-bar
      fixed
      :isBack="false"
      :bottomShadow="false"
      backgroundColor="#FFFFFF"
    >
      <view class="custom-nav tn-flex tn-flex-col-center tn-flex-row-left">
        <!-- 图标logo -->
        <view
          @click="tn('/page-profile/other/about')"
          class="custom-nav__back"
        >
          <view
            class="logo-pic png-sussuspension1"
            style="
              background-image: url('https://mushanyu-app-arr.oss-cn-beijing.aliyuncs.com/static/logo.png');
            "
          >
            <view class="logo-image"> </view>
          </view>
        </view>
        <!-- notice bar -->
        <view
          class="custom-nav__search tn-flex tn-flex-col-center tn-flex-row-center"
          @click="tn('/pages/notice/index')"
        >
          <view
            class="custom-nav__search__box tn-flex tn-flex-col-center tn-flex-row-left"
            style="background-color: rgba(230, 230, 230, 0.3)"
          >
            <view class="tn-color-gray" style="width: 100%">
              <tn-notice-bar
                :list="list"
                mode="vertical"
                :duration="5000"
                rightIconName="notice"
                :leftIcon="false"
                :rightIcon="true"
              ></tn-notice-bar>
            </view>
          </view>
        </view>
      </view>
    </tn-nav-bar>
    <!-- tabs -->
    <view class="tabs-fixed tn-bg-white">
      <view
        class="tn-flex tn-flex-col-between tn-flex-col-center tn-padding-top-sm"
        :style="{ marginTop: vuex_custom_bar_height + 'px' }"
      >
        <view style="width: 100vw; overflow: hidden">
          <tn-tabs
            :list="scrollList"
            :current="current"
            :isScroll="false"
            activeColor="#3668FC"
            :bold="true"
            :fontSize="26"
            :badgeOffset="[20, 120]"
            @change="tabChange"
            backgroundColor="#FFFFFF"
            :height="60"
          ></tn-tabs>
        </view>
      </view>
    </view>

    <!-- 页面内容 -->
    <view class="tn-padding" :style="{ marginTop: optionHeight + 'px' }">
      <view
        v-show="current === 0 && isLogin"
        style="position: relative"
        @click="handleMessageClick(item, index)"
        class="article-shadow tn-bg-white tn-padding tn-margin-bottom"
        v-for="(item, index) in messageList"
        :key="item.id"
      >
        <view
          class="tn-text-ellipsis tn-text-bold"
          style="color: #080808; font-size: 26rpx"
        >
          {{ item.content }}
        </view>
        <view
          style="margin-top: 23rpx"
          class="tn-flex tn-flex-row-between tn-color-gray tn-text-sm"
        >
          <view class="">
            <text class="tn-icon-time" style="padding-right: 6rpx"></text>
            {{ item.createTime | dateFormat }}
          </view>
          <view class="">
            <text class="tn-icon-my" style="padding-right: 6rpx"></text>
            {{ item.senderUserName }}
          </view>
        </view>
        <tn-badge
          v-if="item.readState === 0"
          backgroundColor="#E83A30"
          :dot="true"
          :radius="15"
          :absolute="true"
          :translateCenter="false"
        ></tn-badge>
      </view>

      <view
        v-show="current === 1 && isLogin"
        style="position: relative"
        @click="handleMessageClick(item, index)"
        class="article-shadow tn-bg-white tn-padding tn-margin-bottom"
        v-for="(item, index) in resultMessageList"
        :key="item.id"
      >
        <view
          class="tn-text-ellipsis tn-text-bold"
          style="color: #080808; font-size: 26rpx"
        >
          {{ item.content }}
        </view>
        <view
          style="margin-top: 23rpx"
          class="tn-flex tn-flex-row-between tn-color-gray tn-text-sm"
        >
          <view class="">
            <text class="tn-icon-time" style="padding-right: 6rpx"></text>
            {{ item.createTime | dateFormat }}
          </view>
          <view class="">
            <text class="tn-icon-my" style="padding-right: 6rpx"></text>
            {{ item.senderUserName }}
          </view>
        </view>
        <tn-badge
          v-if="item.readState === 0"
          backgroundColor="#E83A30"
          :dot="true"
          :radius="15"
          :absolute="true"
          :translateCenter="false"
        ></tn-badge>
      </view>
      <tn-load-more v-if="isLogin" :status="status"></tn-load-more>
      <tn-empty
        v-else
        text="请先登录"
        mode="data"
        :imgWidth="200"
        :imgHeight="200"
      ></tn-empty>
    </view>

    <tn-modal
      :showCloseBtn="true"
      @click="handleTipModalConfirm"
      v-model="showTipModal"
      :custom="true"
      @cancel="handleModalCancel"
    >
      <view class="">
        <view class="tn-text-center tn-text-bold" style="font-size: 26rpx">
          <text>消息内容</text>
        </view>
        <view
          class="tn-text-center"
          style="line-height: 1.5; margin-top: 25rpx; font-size: 24rpx"
        >
          {{ message }}
        </view>
      </view>
    </tn-modal>

    <tn-modal
      @click="showModalNotice = false"
      v-model="showModalNotice"
      :custom="true"
      showCloseBtn="true"
    >
      <view class="">
        <view class="tn-text-center tn-text-bold" style="font-size: 26rpx">
          <text>{{ notice.title }}</text>
        </view>
        <view
          class="tn-text-center"
          style="line-height: 1.5; margin-top: 25rpx; font-size: 24rpx"
        >
          {{ notice.content }}
        </view>
      </view>
    </tn-modal>

    <w-loading
      text="拼命处理中..."
      mask="true"
      click="true"
      ref="loading"
    ></w-loading>
    <tn-toast ref="toast"></tn-toast>
    <view class="tn-tabbar-height"></view>
    <view class="bg-tabbar-shadow"></view>
    <privacy-popup
      :previewFileUrl="previewFileUrl"
      ref="privacyComponent"
    ></privacy-popup>
  </view>
</template>

<script>
import PrivacyPopup from "@/components/privacy-popup.vue";
import { queryNoticeListApi } from "@/api/notice.js";
import { queryMyMessageListApi, setMessageToReadApi } from "@/api/message.js";
import { querySysConfigByKeyApi } from "@/api/config.js";
import { dateShow } from "@/utils/index.js";

export default {
  components: {
    PrivacyPopup,
  },
  data() {
    return {
      show: true,
      current: 0,
      list: ["登录后查看"],
      scrollList: [
        {
          name: "待办通知",
          count: 0,
        },
        {
          name: "结果通知",
          count: 0,
        },
      ],
      messageQuery: {
        page: 1,
        size: 10,
      },
      resMessageQuery: {
        page: 1,
        size: 10,
      },
      messageList: [],
      resultMessageList: [],
      loadmore: true,
      resultLoadmore: true,
      showTipModal: false,
      message: "",
      tipModalBtn: [
        {
          text: "已读",
          backgroundColor: "#3668FC",
          fontColor: "#FFFFFF",
        },
      ],
      currentMessage: {},
      currentMessageIndex: 0,
      status: "nomore",
      isLogin: true,
      optionHeight: 0,
      notice: {
        title: "",
        content: "",
      },
      showModalNotice: false,
      previewFileUrl: "",
    };
  },
  filters: {
    dateFormat(date) {
      return dateShow(date, "yyyy年MM月dd日 hh:mm");
    },
  },
  mounted() {
    // 没有登录的情况,要显示对应的界面
    const userInfo = uni.getStorageSync("userInfo");
    const token = uni.getStorageSync("token");
    if (!userInfo || !token) {
      this.isLogin = false;
    }
    querySysConfigByKeyApi("userPrivacyPdfUrl").then((res) => {
      this.previewFileUrl = JSON.parse(res.configValue).url;
    });
    querySysConfigByKeyApi("modalNotice").then((res) => {
      this.notice = JSON.parse(res.configValue);
      if (this.isLogin) {
        if (uni.getStorageSync("modalNoticeVersion") !== "") {
          let version = uni.getStorageSync("modalNoticeVersion");
          // 比较version
          this.showModalNotice = !(this.notice.version === version);
        } else {
          // 展示弹窗
          this.showModalNotice = true;
        }
        uni.setStorageSync("modalNoticeVersion", this.notice.version);
      }
    });
    queryNoticeListApi(1, 3)
      .then((res) => {
        let resList = res.pageData;
        this.list.splice(0, 1);
        resList.forEach((item) => {
          this.list.push(item.title);
        });
      })
      .catch((e) => {
        // console.log(e);
      });
    this.getToDoMessageList();
    this.getResultMessageList();
    this.$nextTick(() => {
      const query = uni.createSelectorQuery().in(this);
      query.select(".tabs-fixed").boundingClientRect((data) => {
        this.optionHeight = Math.ceil(data.height);
      });
      query.exec();
    });
  },
  methods: {
    homeOnShow() {
      const userInfo = uni.getStorageSync("userInfo");
      const token = uni.getStorageSync("token");
      if (!userInfo || !token) {
        this.isLogin = false;
        this.list = ["登录后查看"];
      }
    },
    tn(page) {
      this.$Router.push(page);
    },
    getToDoMessageList() {
      this.$refs.loading.open();
      queryMyMessageListApi(this.messageQuery.page, this.messageQuery.size)
        .then((res) => {
          let list = res.pageInfo.pageData;
          this.scrollList[0].count = res.todoCount;
          this.scrollList[1].count = res.resultCount;
          this.messageList = list;
          this.$refs.loading.close();
          this.isLogin = true;
        })
        .catch((e) => {
          // console.log(e);
          this.$refs.loading.close();
          if (uni.getStorageSync("token")) {
            this.isLogin = true;
          } else {
            this.isLogin = false;
            this.scrollList = [
              {
                name: "待办通知",
                count: 0,
              },
              {
                name: "结果通知",
                count: 0,
              },
            ];
          }
        });
    },
    getResultMessageList() {
      this.$refs.loading.open();
      queryMyMessageListApi(
        this.messageQuery.page,
        this.messageQuery.size,
        "RESULT"
      )
        .then((res) => {
          let list = res.pageInfo.pageData;
          this.scrollList[0].count = res.todoCount;
          this.scrollList[1].count = res.resultCount;
          this.resultMessageList = list;
          this.$refs.loading.close();
          this.isLogin = true;
        })
        .catch((e) => {
          // console.log(e);
          this.$refs.loading.close();
          if (uni.getStorageSync("token")) {
            this.isLogin = true;
          } else {
            this.isLogin = false;
            this.scrollList = [
              {
                name: "待办通知",
                count: 0,
              },
              {
                name: "结果通知",
                count: 0,
              },
            ];
          }
        });
    },
    tabChange(index) {
      this.current = index;
    },
    reachBottom() {
      if (this.current === 0) {
        this.todoListReachBottom();
      } else if (this.current === 1) {
        this.resultListReachBottom();
      }
    },
    todoListReachBottom() {
      if (this.loadmore) {
        this.messageQuery.page += 1;
        this.status = "loading";
        queryMyMessageListApi(this.messageQuery.page, this.messageQuery.size)
          .then((res) => {
            let list = res.pageInfo.pageData;
            if (list.length !== 0) {
              this.messageList.push(...list);
            } else {
              this.loadmore = false;
            }
            this.status = "nomore";
          })
          .catch((e) => {
            // console.log(e);
            this.status = "nomore";
            this.loadmore = false;
          });
      }
    },
    resultListReachBottom() {
      if (this.resultLoadmore) {
        this.resMessageQuery.page += 1;
        this.status = "loading";
        queryMyMessageListApi(
          this.resMessageQuery.page,
          this.resMessageQuery.size,
          "RESULT"
        )
          .then((res) => {
            let list = res.pageInfo.pageData;
            if (list.length !== 0) {
              this.resultMessageList.push(...list);
            } else {
              this.resultLoadmore = false;
            }
            this.status = "nomore";
          })
          .catch((e) => {
            // console.log(e);
            this.status = "nomore";
            this.resultLoadmore = false;
          });
      }
    },
    handleMessageClick(item, index) {
      this.currentMessage = Object.assign({}, item);
      this.currentMessageIndex = index;
      this.message = item.content;
      this.showTipModal = true;
    },
    handleModalCancel() {
      if (this.currentMessage.readState === 0) {
        this.$refs.loading.open();
        setMessageToReadApi(this.currentMessage.id)
          .then((res) => {
            if (this.current === 0) {
              // todo设为已读
              this.messageList[this.currentMessageIndex].readState = 1;
              this.scrollList[0].count -= 1;
            } else if (this.current === 1) {
              // result设为已读
              this.resultMessageList[this.currentMessageIndex].readState = 1;
              this.scrollList[1].count -= 1;
            }
            this.$refs.loading.close();
          })
          .catch((e) => {
            this.$refs.loading.close();
            this.$refs.toast.show({
              title: e.message,
              duration: 1500,
            });
          });
      }
    },
    refresh() {
      if (this.isLogin) {
        this.messageQuery.page = 1;
        this.resMessageQuery.page = 1;
        this.getToDoMessageList();
        this.getResultMessageList();
        this.current = 0;
        this.loadmore = true;
        this.resultLoadmore = true;
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.pages-a {
  width: 100%;
  height: 100%;
  position: relative;
}

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

.tabs-fixed {
  position: fixed;
  top: 0;
  width: 100%;
  transition: all 0.25s ease-out;
  z-index: 1;
}

/* 自定义导航栏内容 start */
.custom-nav {
  height: 100%;

  &__back {
    margin: auto 5rpx;
    font-size: 40rpx;
    margin-right: 10rpx;
    margin-left: 30rpx;
    flex-basis: 5%;
  }

  &__search {
    flex-basis: 60%;
    width: 100%;
    height: 100%;

    &__box {
      width: 100%;
      height: 70%;
      padding: 10rpx 0;
      margin: 0 30rpx;
      border-radius: 60rpx 60rpx 60rpx 60rpx;
      font-size: 24rpx;
    }

    &__icon {
      padding-right: 10rpx;
      margin-left: 20rpx;
      font-size: 30rpx;
    }
  }
}

.logo-image {
  z-index: 9999 !important;
  width: 65rpx;
  height: 65rpx;
  position: relative;
}

.logo-pic {
  z-index: 9999 !important;
  background-size: cover;
  background-repeat: no-repeat;
  // background-attachment:fixed;
  background-position: top;
  border-radius: 50%;
}

/* 旋转 */
.png-sussuspension1 {
  animation: suspension1 12s ease-in-out infinite;
}

@keyframes suspension1 {
  0% {
    transform: rotate(0deg);
  }

  100% {
    transform: rotate(360deg);
  }
}

.article-shadow {
  border-radius: 15rpx;
  box-shadow: 0rpx 0rpx 50rpx 0rpx rgba(0, 0, 0, 0.07);
  // position: relative;
}
</style>
