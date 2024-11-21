<template>
	<view class="" style="position: relative;">
		<view class="tn-flex tn-flex-row-between">
			<view class="tn-flex" style="">
				<view class="tn-flex tn-flex-col-center">
					<tn-avatar
						size="86rpx;"
						:backgroundColor="message.senderUserName | avatarBg"
						:text="message.senderUserName | avatarTxt"
						style="color: #ffffff"></tn-avatar>
				</view>
				<view class="" style="margin-left: 21rpx">
					<view>
						<view class="tn-text-bold" style="font-size: 28rpx">{{
							message.senderUserName
						}}</view>
						<view
							class="tn-color-gray tn-text-ellipsis-2"
							style="font-size: 24rpx; margin-top: 8rpx; line-height: 1.5"
							>{{ message.content }}</view
						>
					</view>
				</view>
			</view>
		</view>

		<view class="tn-color-gray time-show" style="font-size: 21rpx">
			{{ message.createTime | dateFormat }}
		</view>
		<view class="badge-show">
			<tn-badge
				v-if="message.notReadCount !== 0"
				backgroundColor="#e83a30"
				:dot="false"
				fontColor="#FFFFFF"
				:absolute="false"
				:translateCenter="false"
				>{{
					message.notReadCount > 99 ? "99+" : message.notReadCount
				}}</tn-badge
			>
		</view>
	</view>
</template>

<script>
import { dateShow } from "@/utils/index.js";
export default {
	props: {
		message: {},
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
};
</script>

<style>
.time-show {
	position: absolute;
	top: 0;
	right: 0;
}

.badge-show {
  position: absolute;
  bottom: 0;
  right: 0;
}
</style>
