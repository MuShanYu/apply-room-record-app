<template>
	<view class="pages-a">
		<!-- 顶部自定义导航 -->
		<tn-nav-bar
			fixed
			:isBack="false"
			:bottomShadow="false"
			backgroundColor="#FFFFFF">
			<view class="custom-nav tn-flex tn-flex-col-center tn-flex-row-left">
				<!-- 图标logo -->
				<view @click="tn('/page-profile/other/about')" class="custom-nav__back">
					<view
						class="logo-pic png-sussuspension1"
						style="
							background-image: url('https://mushanyu-app-arr.oss-cn-beijing.aliyuncs.com/static/logo.png');
						">
						<view class="logo-image"> </view>
					</view>
				</view>
				<!-- notice bar -->
				<view
					class="custom-nav__search tn-flex tn-flex-col-center tn-flex-row-center"
					@click="tn('/pages/notice/index')">
					<view
						class="custom-nav__search__box tn-flex tn-flex-col-center tn-flex-row-left"
						style="background-color: rgba(230, 230, 230, 0.3)">
						<view class="tn-color-gray" style="width: 100%">
							<tn-notice-bar
								:list="list"
								mode="vertical"
								:duration="5000"
								rightIconName="notice"
								:leftIcon="false"
								:rightIcon="true"></tn-notice-bar>
						</view>
					</view>
				</view>
			</view>
		</tn-nav-bar>
		<!-- tabs -->
		<view class="tabs-fixed tn-bg-white" style="z-index: 99">
			<view
				class="tn-flex tn-flex-col-between tn-flex-col-center tn-padding-top-sm"
				:style="{ marginTop: vuex_custom_bar_height + 'px' }">
				<view style="width: 100vw; overflow: hidden">
					<tn-tabs
						:list="scrollList"
						:current="current"
						:isScroll="true"
						activeColor="#3668FC"
						:bold="true"
						:gutter="42"
						:fontSize="26"
						@change="tabChange"
						:badgeOffset="[18, 26]"
						backgroundColor="#FFFFFF"
						:height="60"></tn-tabs>
				</view>
			</view>
		</view>

		<!-- 页面内容 -->
		<view class="tn-padding" :style="{ marginTop: optionHeight + 'px' }">
			<view
				v-show="current === 0 && isLogin"
				style="position: relative"
				@click="handleMessageClick(item, index)"
				class="msg-box"
				v-for="(item, index) in messageList"
				:key="item.id">
				<msg-card :message="item"></msg-card>
			</view>

			<view
				v-show="current === 1 && isLogin"
				style="position: relative"
				@click="handleMessageClick(item, index)"
				class="msg-box"
				v-for="(item, index) in resultMessageList"
				:key="item.id">
				<msg-card :message="item"></msg-card>
			</view>
			<view
				v-show="current === 2 && isLogin"
				style="position: relative"
				@click="handleMessageClick(item, index)"
				class="msg-box"
				v-for="(item, index) in sysMsgList"
				:key="item.id">
				<msg-card :message="item"></msg-card>
			</view>
			<tn-load-more
				:customStyle="{ fontSize: 26 + 'rpx' }"
				v-if="isLogin"
				:status="status"></tn-load-more>
			<tn-empty
				v-else
				text="请先登录"
				mode="data"
				:imgWidth="200"
				:imgHeight="200"></tn-empty>
		</view>
		<tn-modal
			@click="showModalNotice = false"
			v-model="showModalNotice"
			:custom="true"
			showCloseBtn="true">
			<view class="">
				<view class="tn-text-center tn-text-bold" style="font-size: 26rpx">
					<text>{{ notice.title }}</text>
				</view>
				<view
					class="tn-text-center"
					style="line-height: 1.5; margin-top: 25rpx; font-size: 24rpx">
					{{ notice.content }}
				</view>
			</view>
		</tn-modal>
		<tn-modal v-model="showSessionModal" :custom="true" showCloseBtn="true">
			<view class="">
				<view class="tn-text-lg tn-text-bold tn-text-center">
					建立或搜索会话
				</view>
				<view class="tn-margin-top-lg">
					<tn-input
						v-model="queryName"
						:border="true"
						placeholder="请输入对方姓名"
						type="text"
						placeholderStyle="color:#AAAAAA"
						maxlength="36"></tn-input>
				</view>
				<view class="tn-text-right" style="margin-top: 60rpx">
					<view class="">
						<tn-button
							:disabled="queryName === ''"
							@click="handleSessionModelConfirm"
							:backgroundColor="queryName === '' ? '#E6E6E6' : '#3668FC'"
							fontBold>
							<text class="tn-color-white">确认</text>
						</tn-button>
					</view>
				</view>
			</view>
		</tn-modal>
		<tn-action-sheet
			v-model="showActionSheet"
			:tips="{
				text: '匹配到多位，请选择',
				color: '#AAAAAA',
				fontSize: 24,
			}"
			:list="sessionUserList"
			:borderRadius="20"
			:safeAreaInsetBottom="true"
			@click="handleActionSheetClick"></tn-action-sheet>
		<tn-tips ref="tips" position="top" :top="optionHeight"></tn-tips>
		<w-loading
			text="拼命处理中..."
			mask="true"
			click="true"
			ref="loading"></w-loading>
		<tn-toast ref="toast"></tn-toast>
		<view class="tn-tabbar-height"></view>
		<view class="bg-tabbar-shadow"></view>
		<privacy-popup
			:previewFileUrl="previewFileUrl"
			ref="privacyComponent"></privacy-popup>
	</view>
</template>

<script>
import PrivacyPopup from "@/components/privacy-popup.vue";
import MsgCard from "@/components/msg-card.vue";
import { queryNoticeListApi } from "@/api/notice.js";
import { queryMyMessageListApi } from "@/api/message.js";
import { querySysConfigByKeyApi } from "@/api/config.js";
import { getUserIdApi } from "@/api/user";
import { mapGetters } from "vuex";
const msgType = ["TODO", "RESULT", "SYSTEM"];
export default {
	components: {
		PrivacyPopup,
		MsgCard,
	},
	data() {
		return {
			show: true,
			current: 0,
			list: ["登录后查看"],
			scrollList: [
				{
					name: "待办消息",
					count: 0,
				},
				{
					name: "结果消息",
					count: 0,
				},
				{
					name: "系统消息",
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
			sysMsgQuery: {
				page: 1,
				size: 10,
			},
			messageList: [],
			resultMessageList: [],
			sysMsgList: [],
			loadmore: true,
			resultLoadmore: true,
			sysLoadMore: true,
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
			queryName: "",
			showActionSheet: false,
			sessionUserList: [],
			showSessionModal: false,
		};
	},
	computed: {
		...mapGetters(["websocketData"]),
	},
	watch: {
		websocketData: {
			handler(newValue, oldValue) {
				// 只有在当前页面的时候执行此逻辑
				const pages = getCurrentPages();
				const currentPage = pages[pages.length - 1];
				if (currentPage.route === "pages/index") {
					console.log("home收到新消息");
					let newMsgBody = JSON.parse(newValue);
					if (newMsgBody.type === "user_message") {
						// 收到新消息
						let newMsg = newMsgBody.content;
						this.$refs.tips.show({
							msg: "收到新消息，已为您刷新",
							backgroundColor: "rgba(0, 0, 0, 0.4)",
							fontColor: "#FFFFFF",
							duration: 3000,
						});
						// 刷新对应tab
						this.getMessageList(newMsg.messageType);
					}
				}
			},
			deep: true, // 深度监听对象内的属性变化
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
		if (this.isLogin) {
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
			this.getMessageList(this.current);
		}
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
        this.resetTabs()
			}
		},
		tn(page) {
			this.$Router.push(page);
		},
		async getMessageList(current) {
			this.$refs.loading.open();
			let that = this;
			let res = await this.getMsgList(msgType[current], current);
			let list = res.pageInfo.pageData;
			// console.log(list);
			// 对list进行排序
			list.sort((a, b) => b.createTime - a.createTime);
			this.scrollList[0].count = res.todoCount;
			this.scrollList[1].count = res.resultCount;
			this.scrollList[2].count = res.sysCount;
			switch (current) {
				case 0:
					that.messageList = list;
					break;
				case 1:
					that.resultMessageList = list;
					break;
				case 2:
					that.sysMsgList = list;
					break;
			}
			this.$refs.loading.close();
			this.isLogin = true;
		},
		getMsgList(messageType, current) {
			let query = {};
			if (current === 0) {
				query = this.messageQuery;
			} else if (current === 1) {
				query = this.resMessageQuery;
			} else if (current === 2) {
				query = this.sysMsgQuery;
			}
			return new Promise((resolve, reject) => {
				queryMyMessageListApi(query.page, query.size, messageType)
					.then((res) => {
						resolve(res);
					})
					.catch((e) => {
						// console.log(e);
						this.$refs.loading.close();
						if (uni.getStorageSync("token")) {
							this.isLogin = true;
						} else {
							this.isLogin = false;
						}
						this.resetTabs();
					});
			});
		},
		tabChange(index) {
			this.current = index;
			if (this.current === 0 && this.messageList.length > 0) {
				return;
			} else if (this.current === 1 && this.resultMessageList.length > 0) {
				return;
			} else if (this.current === 2 && this.sysMsgList.length > 0) {
				return;
			}
			this.getMessageList(index);
		},
		resetTabs() {
			this.scrollList = [
				{
					name: "待办消息",
					count: 0,
				},
				{
					name: "结果消息",
					count: 0,
				},
				{
					name: "系统消息",
					count: 0,
				},
			];
		},
		reachBottom() {
			if (this.current === 0) {
				this.todoListReachBottom();
			} else if (this.current === 1) {
				this.resultListReachBottom();
			} else if (this.current === 2) {
				this.sysMsgListReachBottom();
			}
		},
		todoListReachBottom() {
			this.handleListReachBottom(
				"loadmore",
				this.messageQuery,
				this.messageList
			);
		},
		resultListReachBottom() {
			this.handleListReachBottom(
				"resultLoadmore",
				this.resMessageQuery,
				this.resultMessageList,
				"RESULT"
			);
		},
		sysMsgListReachBottom() {
			this.handleListReachBottom(
				"sysLoadMore",
				this.sysMsgQuery,
				this.sysMsgList,
				"SYSTEM"
			);
		},
		handleListReachBottom(loadmoreKey, query, messageList, type) {
			if (this[loadmoreKey]) {
				query.page += 1;
				this.status = "loading";
				queryMyMessageListApi(query.page, query.size, type)
					.then((res) => {
						let list = res.pageInfo.pageData;
						if (list.length !== 0) {
							messageList.push(...list);
							messageList.sort((a, b) => b.createTime - a.createTime);
						} else {
							this[loadmoreKey] = false;
						}
						this.status = "nomore";
					})
					.catch((e) => {
						// console.log(e);
						this.status = "nomore";
						this[loadmoreKey] = false;
					});
			}
		},
		handleMessageClick(item, index) {
			this.$Router.push({
				path: "/pages/message/index",
				query: {
					senderId: item.messageSenderId,
					receiverId: item.messageReceiverId,
					name: item.senderUserName,
					type: item.messageType,
					index,
				},
			});
		},
		handleMsgRead(msgIds, index) {
			if (msgIds && msgIds.length > 0) {
				this.scrollList[this.current].count -= msgIds.length;
				if (this.current === 0) {
					this.messageList[Number(index)].notReadCount -= msgIds.length;
				} else if (this.current === 1) {
					this.resultMessageList[Number(index)].notReadCount -= msgIds.length;
				} else if (this.current === 2) {
					this.sysMsgList[Number(index)].notReadCount -= msgIds.length;
				}
			}
		},
		handleRecieveNewMsg(newMsg, index) {
			if (Number(index) === -1) {
				// 第一次发送消息, 刷新列表
				this.getMessageList(newMsg.messageType);
			} else {
				if (this.current === 0) {
					this.messageList[Number(index)].createTime = newMsg.createTime;
					this.messageList[Number(index)].content = newMsg.content;
				} else if (this.current === 1) {
					this.resultMessageList[Number(index)].createTime = newMsg.createTime;
					this.resultMessageList[Number(index)].content = newMsg.content;
				} else if (this.current === 2) {
					this.sysMsgList[Number(index)].createTime = newMsg.createTime;
					this.sysMsgList[Number(index)].content = newMsg.content;
				}
			}
		},
		refresh() {
			if (this.isLogin) {
				this.messageQuery.page = 1;
				this.resMessageQuery.page = 1;
				this.sysMsgQuery.page = 1;
				this.current = 0;
				this.loadmore = true;
				this.resultLoadmore = true;
				this.sysLoadMore = true;
				this.sysMsgList = [];
				this.messageList = [];
				this.resultMessageList = [];
				this.getMessageList(this.current);
			}
		},
		handleAddMsgSession() {
			this.showSessionModal = true;
		},
		handleSessionModelConfirm() {
			getUserIdApi(this.queryName).then((list) => {
				console.log("查询结果", list);
				let that = this;
				let senderId = uni.getStorageSync("userInfo").id;
				this.showSessionModal = false;
				if (list.length === 1) {
					let user = list[0];
					this.$Router.push({
						path: "/pages/message/index",
						query: {
							senderId: senderId,
							receiverId: user.userId,
							name: user.name,
							type: that.current,
							index: -1,
						},
					});
				} else if (list.length > 1) {
					this.sessionUserList = list;
					this.sessionUserList.forEach((item) => {
						item.text = `${item.stuNum}   ${item.name}`;
					});
					this.showActionSheet = true;
				} else if (list.length === 0) {
					this.$refs.toast.show({
						title: "未匹配到对应用户",
						duration: 2000,
					});
				}
			});
		},
		handleActionSheetClick(index) {
			let that = this;
			let senderId = uni.getStorageSync("userInfo").id;
			this.showSessionModal = false;
			let user = this.sessionUserList[index];
			this.showActionSheet = false;
			this.$Router.push({
				path: "/pages/message/index",
				query: {
					senderId: senderId,
					receiverId: user.userId,
					name: user.name,
					type: that.current,
					index: -1,
				},
			});
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

.msg-box {
	// border-radius: 15rpx;
	// box-shadow: 0rpx 0rpx 50rpx 0rpx rgba(0, 0, 0, 0.07);
	// position: relative;
	background: #fff;
	padding: 0rpx 0rpx 60rpx 0rpx;
}
</style>
