<template>
	<view>
		<tn-nav-bar fixed customBack>
			<view slot="back" class="tn-custom-nav-bar__back" @click="goBack">
				<text class="icon tn-icon-left"></text>
			</view>
			<view slot="default" class=""> {{senderName}} </view>
		</tn-nav-bar>
		<view :style="{ marginTop: vuex_custom_bar_height + 'px' }">
			<view
				class="tips color_fff size_12 align_c"
				:class="{ show: ajax.loading }"
				@tap="getHistoryMsg"
				>{{ ajax.loadText }}</view
			>
			<view class="box-1" id="list-box">
				<view class="talk-list">
					<view
						v-for="(item, index) in talkList"
						:key="index"
						:id="`msg-${item.id}`">
						<view
							class="item flex_col"
							:class="item.type == 1 ? 'push' : 'pull'">
							<tn-avatar
								v-if="item.type === 0"
								size="76rpx;"
								:backgroundColor="senderName | avatarBg"
								:text="senderName | avatarTxt"
								style="color: #ffffff; font-size: 28rpx"></tn-avatar>
							<tn-avatar
								v-else
								size="76rpx;"
								:backgroundColor="curName | avatarBg"
								:text="curName | avatarTxt"
								style="color: #ffffff; font-size: 28rpx"></tn-avatar>
							<view class="content">
								<view>{{ item.content }}</view>
								<view
									:class="item.type === 1 ? 'tn-text-left' : 'tn-text-right'"
									class="tn-text-xs"
									style=""
									:style="{ color: item.type === 1 ? '#fff' : '#AAAAAA' }"
									>{{ item.createTime | dateFormat }}</view
								></view
							>
							<view
								v-if="item.type === 1"
								class="tn-text-xs tn-color-gray tn-margin-right-sm"
								><view>{{ item.readState === 0 ? "未读" : "已读" }}</view></view
							>
						</view>
					</view>
				</view>
			</view>
			<view class="box-2">
				<view class="flex_col">
					<view class="flex_grow">
						<input
							type="text"
							class="content"
							v-model="content"
							placeholder="请输入聊天内容"
							placeholder-style="color:#DDD;"
							:cursor-spacing="6" />
					</view>
					<button style="font-size: 26rpx" class="send" @tap="send">
						发送
					</button>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
import {
	queryMyMsgDetailList,
	saveMessageApi,
	setMessageToReadApi,
} from "@/api/message";
import { dateShow } from "@/utils/index";

import { mapGetters } from "vuex";
export default {
	data() {
		return {
			talkList: [],
			ajax: {
				rows: 10, //每页数量
				page: 1, //页码
				flag: true, // 请求开关
				loading: true, // 加载中
				loadText: "正在获取消息",
			},
			senderId: "",
			receiverId: "",
			msgType: null,
			senderName: "",
			content: "",
			curName: "",
			curUserId: "",
			curMsgIndex: 0,
		};
	},
	filters: {
		dateFormat(date) {
			return dateShow(date, "yyyy年MM月dd日 hh:mm");
		},
		avatarBg(name) {
			let charCode = name.charAt(0).charCodeAt(0);
			const hexColor =
				"#" +
				(charCode % 256).toString(16).padStart(2, "0") +
				(charCode % 128).toString(16).padStart(2, "0") +
				(charCode % 64).toString(16).padStart(2, "0");

			return hexColor;
		},
		avatarTxt(name) {
			let val = name.substring(1);
			if (val.length > 2) {
				val = name.substring(name.length - 2);
			}
			return val;
		},
	},
	onLoad(param) {
		this.senderId = param.senderId;
		this.receiverId = param.receiverId;
		this.senderName = param.name;
		this.msgType = param.type;
		this.curMsgIndex = param.index;
		this.curName = uni.getStorageSync("userInfo").name;
		this.curUserId = uni.getStorageSync("userInfo").id;
	},
	mounted() {
		this.$nextTick(() => {
			this.getHistoryMsg();
		});
	},
	onPageScroll(e) {
		if (e.scrollTop < 10) {
			this.getHistoryMsg();
		}
	},
	computed: {
		...mapGetters(["websocketData"]),
	},
	watch: {
		websocketData: {
			handler(newValue, oldValue) {
				// 在这里处理websocketData变化后的逻辑
				// console.log("socket 数据发送变化", newValue);
				let newMsgBody = JSON.parse(newValue);
				if (newMsgBody.type === "user_message") {
					// 收到新消息
					let newMsg = newMsgBody.content;
					if (
						newMsg.messageSenderId === this.senderId &&
						newMsg.messageReceiverId === this.senderId
					) {
						newMsg.type = 1;
					} else {
						newMsg.type = newMsg.messageSenderId === this.curUserId ? 1 : 0;
					}
					this.talkList.push(newMsg);
					this.$nextTick(() => {
						uni.pageScrollTo({
							scrollTop: 999999, // 设置一个超大值，以保证滚动条滚动到底部
							duration: 0,
						});
					});
					setMessageToReadApi([newMsg.id]).then(() => {
						this.notifyMsgToRead([newMsg.id]);
						newMsg.readState = 1;
					});
					uni.$emit("receiveNewMsg", { newMsg, index: this.curMsgIndex });
				} else if (newMsgBody.type === "user_message_read") {
					// 消息列表中id相同的置为已读
					let msgIds = newMsgBody.content;
					// talkList中id于msgIds相同的
					this.talkList.forEach((item) => {
						if (msgIds.includes(item.id)) {
							item.readState = 1;
						}
					});
				}
			},
			deep: true, // 深度监听对象内的属性变化
		},
	},
	methods: {
		// 获取历史消息
		getHistoryMsg() {
			if (!this.ajax.flag) {
				return; //
			}

			// 此处用到 ES7 的 async/await 知识，为使代码更加优美。不懂的请自行学习。
			let get = async () => {
				this.hideLoadTips();
				this.ajax.flag = false;
				let data = await this.joinHistoryMsg();
				// 将我收到的消息置为已读
				this.setMsgToRead(data);
				// console.log("----- 数据格式，供参考 -----");
				// console.log(data); // 查看请求返回的数据结构
				if (!data || data.length === 0) {
					this.hideLoadTips(true);
					return;
				}
				// 获取待滚动元素选择器，解决插入数据后，滚动条定位时使用
				let selector = "";

				if (this.ajax.page > 1) {
					// 非第一页，则取历史消息数据的第一条信息元素
					selector = `#msg-${this.talkList[0].id}`;
				} else {
					// 第一页，则取当前消息数据的最后一条信息元素
					selector = `#msg-${data[data.length - 1].id}`;
				}

				// 将获取到的消息数据合并到消息数组中
				this.talkList = [...data, ...this.talkList];

				// 数据挂载后执行，不懂的请自行阅读 Vue.js 文档对 Vue.nextTick 函数说明。
				this.$nextTick(() => {
					// 设置当前滚动的位置
					this.setPageScrollTo(selector);

					this.hideLoadTips(true);

					if (data.length < this.ajax.rows) {
						// 当前消息数据条数小于请求要求条数时，则无更多消息，不再允许请求。
						// 可在此处编写无更多消息数据时的逻辑
					} else {
						this.ajax.page++;

						// 延迟 200ms ，以保证设置窗口滚动已完成
						setTimeout(() => {
							this.ajax.flag = true;
						}, 200);
					}
				});
			};
			get();
		},
		// 拼接历史记录消息，正式项目可替换为请求历史记录接口
		joinHistoryMsg() {
			// 此处用到 ES6 的 Promise 知识，不懂的请自行学习。
			return new Promise((done, fail) => {
				// 无数据请求接口，由 setTimeout 模拟，正式项目替换为 ajax 即可。
				queryMyMsgDetailList(
					this.ajax.page,
					this.ajax.rows,
					this.senderId,
					this.receiverId,
					this.msgType
				).then((res) => {
					res.pageData.forEach((element) => {
						if (
							element.messageSenderId === this.senderId &&
							element.messageReceiverId === this.senderId
						) {
							element.type = 1;
						} else {
							element.type = element.messageSenderId === this.curUserId ? 1 : 0;
						}
					});
					res.pageData.reverse();
					done(res.pageData);
				});
			});
		},
		setMsgToRead(msgList) {
			let needSetIdList = [];
			msgList.forEach((item) => {
				if (item.messageReceiverId === this.curUserId && item.readState === 0) {
					needSetIdList.push(item.id);
					item.readState = 1;
				}
			});
			if (needSetIdList.length === 0) return;
			this.notifyMsgToRead(needSetIdList);
			setMessageToReadApi(needSetIdList).then((res) => {
				uni.$emit("setMsgToRead", {
					msgIds: needSetIdList,
					index: this.curMsgIndex,
				});
			});
		},
		notifyMsgToRead(idList) {
			if (idList.length === 0) return;
			// 发送socket消息告知已读
			let receiver =
				this.receiverId === this.curUserId ? this.senderId : this.receiverId;
			let msgBody = {
				content: idList,
				type: "user_message_read",
				toUserId: receiver,
			};
			this.$store.dispatch("websocketSend", JSON.stringify(msgBody));
		},
		// 设置页面滚动位置
		setPageScrollTo(selector) {
			let view = uni.createSelectorQuery().in(this).select(selector);
			view
				.boundingClientRect((res) => {
					uni.pageScrollTo({
						scrollTop: res.top - 30, // -30 为多显示出大半个消息的高度，示意上面还有信息。
						duration: 0,
					});
				})
				.exec();
		},
		// 隐藏加载提示
		hideLoadTips(flag) {
			if (flag) {
				this.ajax.loadText = "消息获取成功";
				setTimeout(() => {
					this.ajax.loading = false;
				}, 300);
			} else {
				this.ajax.loading = true;
				this.ajax.loadText = "正在获取消息";
			}
		},
		// 发送信息
		send() {
			if (!this.content) {
				uni.showToast({
					title: "请输入有效的内容",
					icon: "none",
				});
				return;
			}
			uni.showLoading({
				title: "正在发送",
			});
			let receiver =
				this.receiverId === this.curUserId ? this.senderId : this.receiverId;
			let msg = {
				messageType: this.msgType,
				content: this.content,
				messageReceiverId: receiver,
			};
			saveMessageApi(msg).then((res) => {
				if (res.messageReceiverId !== res.messageSenderId) {
					let msgBody = {
						content: res,
						type: "user_message",
						toUserId: receiver,
					};
					this.$store.dispatch("websocketSend", JSON.stringify(msgBody));
				}
				uni.hideLoading();
				res.type = 1;
				// 将当前发送信息 添加到消息列表。
				this.talkList.push(res);
				uni.$emit("receiveNewMsg", { newMsg: res, index: this.curMsgIndex });
				// 更新前一个页面的最新消息展示
				this.$nextTick(() => {
					// 清空内容框中的内容
					this.content = "";
					uni.pageScrollTo({
						scrollTop: 999999, // 设置一个超大值，以保证滚动条滚动到底部
						duration: 0,
					});
				});
			});
		},
	},
};
</script>

<style lang="scss">
@import "./message.scss";
page {
	background-color: #f3f3f3;
	font-size: 28rpx;
}
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
	color: #ffffff;
	font-size: 18px;

	.icon {
		display: block;
		flex: 1;
		margin: auto;
		text-align: center;
	}
}
/* 加载数据提示 */
.tips {
	position: fixed;
	left: 0;
	width: 100%;
	z-index: 9;
	background-color: rgba(0, 0, 0, 0.5);
	height: 72rpx;
	line-height: 72rpx;
	transform: translateY(-80rpx);
	transition: transform 0.3s ease-in-out 0s;

	&.show {
		transform: translateY(0);
	}
}

.box-1 {
	width: 100%;
	height: auto;
	padding-bottom: 100rpx;
	box-sizing: content-box;

	/* 兼容iPhoneX */
	margin-bottom: 0;
	margin-bottom: constant(safe-area-inset-bottom);
	margin-bottom: env(safe-area-inset-bottom);
}
.box-2 {
	position: fixed;
	left: 0;
	width: 100%;
	bottom: 0;
	height: auto;
	z-index: 2;
	border-top: #e5e5e5 solid 1px;
	box-sizing: content-box;
	background-color: #f3f3f3;

	/* 兼容iPhoneX */
	padding-bottom: 0;
	padding-bottom: constant(safe-area-inset-bottom);
	padding-bottom: env(safe-area-inset-bottom);

	> view {
		padding: 0 20rpx;
		height: 100rpx;
	}

	.content {
		background-color: #fff;
		height: 64rpx;
		padding: 0 20rpx;
		border-radius: 32rpx;
		font-size: 24rpx;
	}

	.send {
		background-color: #3668fc;
		color: #fff;
		height: 64rpx;
		margin-left: 20rpx;
		border-radius: 32rpx;
		padding: 0;
		width: 120rpx;
		line-height: 62rpx;
	}
}

.talk-list {
	padding-bottom: 20rpx;

	/* 消息项，基础类 */
	.item {
		padding: 20rpx 20rpx 20rpx 20rpx;
		align-items: flex-start;
		align-content: flex-start;
		color: #333;
		.content {
			padding-left: 20rpx;
			padding-right: 20rpx;
			padding-top: 20rpx;
			border-radius: 4px;
			max-width: 500rpx;
			word-break: break-all;
			line-height: 46rpx;
			position: relative;
		}

		/* 收到的消息 */
		&.pull {
			.content {
				margin-left: 32rpx;
				background-color: #fff;

				&::after {
					content: "";
					display: block;
					width: 0;
					height: 0;
					border-top: 16rpx solid transparent;
					border-bottom: 16rpx solid transparent;
					border-right: 20rpx solid #fff;
					position: absolute;
					top: 30rpx;
					left: -18rpx;
				}
			}
		}

		/* 发出的消息 */
		&.push {
			/* 主轴为水平方向，起点在右端。使不修改DOM结构，也能改变元素排列顺序 */
			flex-direction: row-reverse;

			.content {
				margin-right: 32rpx;
				background-color: #3d79fe;
				color: #fff;
				&::after {
					content: "";
					display: block;
					width: 0;
					height: 0;
					border-top: 16rpx solid transparent;
					border-bottom: 16rpx solid transparent;
					border-left: 20rpx solid #3d79fe;
					position: absolute;
					top: 30rpx;
					right: -18rpx;
				}
			}
		}
	}
}
</style>
