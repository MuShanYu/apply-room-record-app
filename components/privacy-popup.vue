<template>
	<view class="">
		<tn-popup v-model="showPrivacy" mode="bottom" :maskCloseable="false" :borderRadius="15" :zIndex="9999999">
			<view class="" style="padding: 30rpx;">
				<view class="">
					<view class="content-title" style="">隐私保护指引</view>
					<view class="content" style="">
						感谢选择我们的小程序，我们非常重视您的个人信息安全和隐私保护。根据最新法律要求，使用我们的产品前，请仔细阅读“<text style="color: #07c160;" class=""
							@tap="openPrivacyContract">{{privacyContractName}}
						</text>”，以便我们向您提供更优质的服务！<br />我们将尽全力保护您的个人信息及合法权益，感谢您的信任！如您拒绝将无法使用所提供的服务，感谢您的理解！
						<br />
					</view>
				</view>
				<view class="" style="display: flex;margin-top: 30rpx;">
					<button class="reject-btn" @tap="exitMiniProgram">拒绝</button>
					<button id="agree-btn" class="aggree-btn" open-type="agreePrivacyAuthorization"
						@agreeprivacyauthorization="handleAgreePrivacyAuthorization">同意</button>
				</view>
			</view>
		</tn-popup>
	</view>
</template>

<script>
	export default {
		name: 'PrivacyPopup',
		data() {
			return {
				privacyContractName: '',
				showPrivacy: false,
				isRead: false,
				resolvePrivacyAuthorization: null,
			};
		},
		mounted() {
			if (wx.onNeedPrivacyAuthorization) {
				wx.onNeedPrivacyAuthorization((resolve) => {
					this.resolvePrivacyAuthorization = resolve;
				});
			}

			if (wx.getPrivacySetting) {
				wx.getPrivacySetting({
					success: (res) => {
						if (res.needAuthorization) {
							this.privacyContractName = res.privacyContractName;
							this.showPrivacy = true;
						}
					},
				});
			}
		},

		methods: {
			openPrivacyContract() {
				wx.openPrivacyContract({
					success: () => {
						this.isRead = true;
					},
					fail: () => {
						uni.showToast({
							title: '遇到错误',
							icon: 'error',
						});
					},
				});
			},
			exitMiniProgram() {
				this.$emit('reject-privacy'); // 当用户拒绝隐私政策时发出事件
				wx.exitMiniProgram();

			},
			handleAgreePrivacyAuthorization() {
				// if (this.isRead) {
				this.showPrivacy = false;
				this.$emit('agree-privacy'); // 当用户同意隐私政策时发出事件
				if (typeof this.resolvePrivacyAuthorization === 'function') {
					this.resolvePrivacyAuthorization({
						buttonId: 'agree-btn',
						event: 'agree',
					});
				}
			},
		},
	};
</script>

<style scoped lang="scss">
	.content-title {
		font-weight: bold;
		font-size: 28rpx;
		text-align: center;
	}

	.content {
		margin-top: 30rpx;
		font-size: 26rpx;
		line-height: 1.5;
	}

	.aggree-btn {
		background-color: #3668FC;
		color: #fff;
		width: 60%;
		padding: 0;
		font-size: 26rpx;
		margin-left: 15rpx;
	}

	.reject-btn {
		background-color: #AAAAAA;
		color: #fff;
		width: 40%;
		padding: 0;
		font-size: 26rpx;
		margin-right: 15rpx;
	}
</style>