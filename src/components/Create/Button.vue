<template>
	<CButton
		color="primary"
		style="color: #ffffff"
		size="lg"
		@click="handleClick"
		:disabled="isDisabled"
	>
		<!-- <span v-if="step === 'loading'" />
		<span v-else-if="step === 'login'" v-text="'Connect wallet'" />
		<span v-else-if="step === 'proxy'" v-text="'Setup proxy'" /> -->
		<!-- <span
			v-else-if="step === 'approval'"
			v-text="`Unlock ${nextRequiredApproval.symbol}`"
		/> -->
		<!-- <span v-else-if="step === 'approval'" v-text="`Unlock `" />

		<UiLoading v-if="step === 'loading'" />
		<span v-else-if="step === 'login'" v-text="'Connect wallet'" />
		<span v-else-if="step === 'proxy'" v-text="'Setup proxy'" /> -->
		<!-- <span
			v-else-if="step === 'approval'"
			v-text="`Unlock ${nextRequiredApproval.symbol}`"
		/> -->
		<!-- <span v-else-if="step === 'approval'" v-text="`Unlock `" /> -->
		<span v-text="`Create`" />
	</CButton>
</template>

<script>
import { mapActions } from "vuex";
import { bnum, scale } from "@/lib/utils";
import { createPool } from "@/helpers/web3";
import config from "@/config"

export default {
	props: {
		disabled: !Boolean,
		loading: !Boolean,
		requireLogin: !Boolean,
		requireProxy: !Boolean,
		requireApprovals: !Object,
	},
	data() {
		return {
			isLoading: false,
		};
	},
	watch: {
		// requireApprovals(value, oldValue) {
		// 	if (
		// 		value &&
		// 		oldValue &&
		// 		JSON.stringify(Object.keys(value)) !==
		// 			JSON.stringify(Object.keys(oldValue))
		// 	) {
		// 		this.getAllowances(Object.keys(value));
		// 	}
		// },
	},
	computed: {
		step() {
			// if (this.loading || this.isLoading) return "loading";
			// if (this.requireLogin && !this.$auth.isAuthenticated)
			// if (this.requireLogin) return "login";
			// if (this.requireProxy && !this.$store.state.web3.dsProxyAddress) return "proxy";
			// if (this.requireApprovals && this.nextRequiredApproval)
			// 	return "approval";
			if (this.disabled) return false;
			return false;
		},
		stepTip() {
			if (this.step === "login") {
				return this.$t("connectWalletToAddLiquidity");
			} else if (this.step === "proxy") {
				return this.$t("createProxyTip");
			} else if (this.step === "approval") {
				return this.$t("approveToken");
			}
			return undefined;
		},
		isDisabled() {
			return this.disabled || this.step === "loading";
		},
		nextRequiredApproval() {
			if (!this.requireApprovals) return false;
			const allowances = Object.fromEntries(
				Object.entries(
					this.$store.state.web3.allowances
				).map((allowance) => [
					allowance[0],
					allowance[1][this.$store.state.web3.dsProxyAddress],
				])
			);
			let nextRequiredApproval = false;
			console.log(this.requireApprovals);
			Object.entries(this.requireApprovals).forEach(
				(requiredApproval) => {
					const token = this.$store.state.web3.tokenMetadata[
						requiredApproval[0]
					];
					console.log(requiredApproval[1]);
					console.log(
						this.$store.state.web3.tokenMetadata[
							requiredApproval[0]
						]
					);
					const requiredAmount = scale(
						bnum(requiredApproval[1]),
						token.decimals
					);
					const allowedAmount = bnum(allowances[requiredApproval[0]]);
					const allowanceIsEnough = allowedAmount.gte(requiredAmount);
					if (
						token &&
						nextRequiredApproval === false &&
						(!allowances[requiredApproval[0]] || !allowanceIsEnough)
					) {
						nextRequiredApproval = {
							address: requiredApproval[0],
							symbol: token
								? this._shorten(token.symbol, 14)
								: this._shortenAddress(requiredApproval[0]),
							amount: requiredApproval[1],
						};
					}
				}
			);
			return nextRequiredApproval;
		},
	},
	methods: {
		// ...mapActions(["createProxy", "getAllowances", "approve"]),
		async handleClick() {
			// if (this.step === "proxy") return this.handleCreateProxy();
			// if (this.step === "approval") return this.handleApprove();
			// if (!this.step) return this.$emit("submit");
			await createPool(this.$store.state.web3.userInfo.account,config.address.cFactory,config.messageAbi.createPoool, this.requireApprovals);
		},
		async handleCreateProxy() {
			this.isLoading = true;
			try {
				await this.createProxy();
			} catch (e) {
				console.error(e);
			}
			this.isLoading = false;
		},
		async handleApprove() {
			this.isLoading = true;
			try {
				await this.approve(this.nextRequiredApproval.address);
				await this.getAllowances([this.nextRequiredApproval.address]);
			} catch (e) {
				console.error(e);
			}
			this.isLoading = false;
		},
	},
};
</script>
