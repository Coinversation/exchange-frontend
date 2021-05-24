<template>
	<CRow>
		<CCol col="12">
			<CCardBody>
				<div class="row">
					<div class="col-6">
						<CNav variant="pills">
							<CNavItem active> Shared </CNavItem>
						</CNav>
					</div>
					<div class="col-6 d-flex justify-content-end">
						<CButton
							v-if="tokenFilterList.length < 3"
							color="warning"
							style="color: #ffffff"
							@click="addToken"
						>
							Add token</CButton
						>
					</div>
				</div>
			</CCardBody>
		</CCol>
		<CCol col="12">
			<CCard>
				<CCardHeader>
					<h4>Assets</h4>
				</CCardHeader>
				<CPoolList
					:tokenFilterList="tokenFilterList"
					:fields="fields"
					:weights="weights"
				/>
				<CCardHeader>
					<h4>Swap fee (%)</h4>
					<CCol col="2">
						<CInput
							:is-valid="validator"
							width="20px"
							:value="swapFee"
							type="number"
						></CInput>
					</CCol>
				</CCardHeader>
			</CCard>
			<!-- <CCard> -->
			<CAlert
				style="
					background-color: #0e0e15;
					color: #ff8a80;
					border: 1px solid #ff8a80;
				"
				color="danger"
				:show.sync="alert1"
				class=""
			>
				Coinversation Labs is not liable for any losses you might incur
				as a direct or indirect result of adding liquidity to this pool.
				<CButton
					class="position-absolute"
					color="secondary"
					style="
						right: 10px;
						top: 50%;
						transform: translateY(-50%);
						background-color: #0e0e15;
						color: #ff8a80;
						border: 1px solid #ff8a80;
					"
					@click="(alert1 = false), (warningAccepted = true)"
				>
					I agree
				</CButton>
			</CAlert>

			<CCol col="1">
				<CreateButton
					:requireLogin="true"
					:requireProxy="true"
					:requireApprovals="requiredApprovals"
					:loading="loading"
					:disabled="!warningAccepted"
					@submit="confirmModalOpen = true"
				/>
			</CCol>
		</CCol>

		<CModal
			:show.sync="darkModal"
			:no-close-on-backdrop="true"
			:centered="true"
			title="Connect wallet"
			size="lg"
			color="dark"
		>
			<CCol xs="12" md="12">
				<CCard> </CCard>
			</CCol>
			<template #header>
				<h6 class="modal-title">Select token</h6>
				<CButtonClose @click="darkModal = false" class="text-white" />
			</template>
			<template #footer>
				<div></div>
			</template>
		</CModal>
	</CRow>
</template>

<script>
import Vue from "vue";
import { mapActions } from "vuex";

import { bnum, scale, toWei } from "../../lib/utils";

import CPoolList from "../../components/List/CPoolList";
import CreateButton from "../../components/Create/Button";
import { getTokenBySymbol } from "@/lib/utils";
import { addressEq } from "@polkadot/util-crypto";

import config from "@/config";
import {
	getDivisor,
	getMaxPercentage,
	getDenorm,
	isValidDenormValue,
} from "@/lib/weights";

function getAnotherToken(tokens, selectedTokens) {
	console.log(tokens);
	console.log(selectedTokens);
	const tokenAddresses = Object.keys(tokens);
	console.log(90, tokenAddresses);
	for (const tokenAddress of tokenAddresses) {
		const token = tokens[tokenAddress];
		if (token.symbol === "DOT") {
			console.log(123);
			continue;
		}
		if (!selectedTokens.includes(token)) {
			console.log(token.address);
			return token;
		}
	}
}

export default {
	name: "Users",
	data() {
		return {
			darkModal: false,
			alert1: true,
			loading: false,

			fields: [
				{
					key: "assets",
					label: "Assets",
					_classes: "font-weight-bold",
				},
				{ key: "myBalance", label: "My balance" },
				{ key: "weights", label: "Weights" },
				{ key: "percent", label: "Percent" },
				{ key: "amount", label: "Amount" },
				{ key: "price", label: "Price" },
				{ key: "totalValue", label: "Total value" },
				{ key: "remove", label: "" },
			],
			activePage: 1,
			filterTokenData: [],
			amounts: {},
			weights: {},
			swapFee: "0.15",
			warningAccepted: false,
		};
	},
	components: {
		CPoolList,
		CreateButton,
	},
	watch: {
		$route: {
			immediate: true,
			handler(route) {
				if (route.query && route.query.page) {
					this.activePage = Number(route.query.page);
				}
			},
		},
	},
	computed: {
		pool() {
			if (this.validationError) {
				return;
			}
			const tokens = this.tokens.map((token) => {
				return {
					checksum: token,
					weightPercent: this.getPercentage(token),
				};
			});
			const swapFee = (parseFloat(this.swapFee) / 100).toString();
			const liquidity = "0";
			return {
				tokens,
				swapFee,
				liquidity,
			};
		},
		validationError() {
			for (const token of this.tokens) {
				const amountError = validateNumberInput(this.amounts[token]);
				const amountErrorText = formatError(
					amountError,
					`${this.$t("token")} ${this.$t("amount")}`
				);
				if (amountErrorText) return amountErrorText;
				const weightError = validateNumberInput(this.weights[token]);
				const weightErrorText = formatError(
					weightError,
					this.$t("weight")
				);
				if (weightErrorText) return weightErrorText;
			}
			const feeError = validateNumberInput(this.swapFee);
			const feeErrorText = formatError(feeError, this.$t("swapFee"));
			if (feeErrorText) return feeErrorText;
			// Token count validation
			if (this.tokens.length < 2) {
				return this.$t("errMinPoolTokens");
			}
			if (this.tokens.length > 8) {
				return this.$t("errMaxPoolTokens");
			}
			// Weight validation
			for (const token of this.tokens) {
				if (!this.isDenormValid(token)) {
					return this.$t("errInvalidDenorm", {
						min: getDivisor(this.isSharedOrLocked()),
						max: getMaxPercentage(this.isSharedOrLocked()),
					});
				}
			}
			// Amount validation
			for (const token of this.tokens) {
				const amount = bnum(this.amounts[token]);
				const weiAmount = denormalizeBalance(
					amount,
					this.web3.tokenMetadata[token].decimals
				);
				if (weiAmount.lt("1e6")) {
					return this.$t("errMinTokenBalance");
				}
				const balance = normalizeBalance(
					this.web3.balances[token],
					this.web3.tokenMetadata[token].decimals
				);
				if (amount.gt(balance)) {
					return this.$t("errExceedsBalance");
				}
			}
			// Fee validation
			const fee = parseFloat(this.swapFee);
			if (fee < 0.0001 || fee > 10) {
				return this.$t("errFeeRange");
			}
			// Smart pool validation
			if (this.type == "SMART_POOL") {
				if (!this.crp.poolTokenSymbol) {
					return this.$t("errEmptyTokenSymbol");
				}
				if (!this.crp.poolTokenName) {
					return this.$t("errEmptyTokenName");
				}

				const weightPeriodError = validateNumberInput(
					this.crp.minimumWeightChangeBlockPeriod
				);
				const weightPeriodErrorText = formatError(
					weightPeriodError,
					this.$t("minimumUpdateErr")
				);
				if (this.crp.rights.canChangeWeights && weightPeriodErrorText)
					return weightPeriodErrorText;
				const addTimelockError = validateNumberInput(
					this.crp.addTokenTimeLockInBlocks
				);
				const addTimelockErrorText = formatError(
					addTimelockError,
					this.$t("timeLockErr")
				);
				if (this.crp.rights.canAddRemoveTokens && addTimelockErrorText)
					return addTimelockErrorText;
				const initialSupplyError = validateNumberInput(
					this.crp.initialSupply
				);
				const initialSupplyErrorText = formatError(
					initialSupplyError,
					this.$t("initialSupply")
				);
				if (initialSupplyErrorText) return initialSupplyErrorText;

				const weightPeriod = parseFloat(
					this.crp.minimumWeightChangeBlockPeriod
				);
				const addTimelock = parseFloat(
					this.crp.addTokenTimeLockInBlocks
				);
				if (
					this.crp.rights.canChangeWeights &&
					this.crp.rights.canAddRemoveTokens &&
					weightPeriod < addTimelock
				) {
					return this.$t("errInconsistentTimelock");
				}
				const initialSupply = parseFloat(this.crp.initialSupply);
				if (initialSupply < 100 || initialSupply > 1e9) {
					return this.$t("errInitialSupplyRange");
				}
			}
			return undefined;
		},
		// requiredApprovals() {
		// 	return Object.fromEntries(
		// 		this.tokenFilterList.map((token) => [token, token.amounts])
		// 	);
		// },

        requiredApprovals() {
			return Object.fromEntries(
				this.tokenFilterList.map((token) => [token, token.amounts[token]])
			);
		},
	},
	created() {
		const dai = getTokenBySymbol("DAI");
		const usdc = getTokenBySymbol("USDC");
		dai.weights = 60;
		usdc.weights = 40;

		console.log(dai);
		// Vue.set(this.weights, dai.address, "60");
		// Vue.set(this.weights, usdc.address, "40");
		// console.log(this.weights);
		this.tokenFilterList = [dai, usdc];
		this.$store.commit("TOKEN_FILTER_LIST", this.tokenFilterList);
		// this.weights = "";
		// this.amounts = "";
		this.loading = false;
	},
	methods: {
		...mapActions(["createProxy", "getAllowances", "approve"]),
		async create() {
			this.loading = true;
			const weights = this.tokens.map((token) =>
				toWei(
					getDenorm(
						this.getPercentage(token),
						this.isSharedOrLocked()
					).toString()
				).toString()
			);

			if (this.type === "SHARED_POOL") {
				const poolParams = {
					tokens: this.tokens,
					balances: this.amounts,
					weights: weights,
					swapFee: this.swapFee,
				};
				await this.createPool(poolParams);
			}
			if (this.type === "SMART_POOL") {
				const {
					poolTokenSymbol,
					poolTokenName,
					rights,
					minimumWeightChangeBlockPeriod,
					addTokenTimeLockInBlocks,
					initialSupply,
				} = this.crp;
				const poolParams = {
					poolTokenSymbol,
					poolTokenName,
					constituentTokens: this.tokens,
					tokenBalances: this.amounts,
					tokenWeights: weights,
					swapFee: this.swapFee,
				};
				const crpParams = {
					minimumWeightChangeBlockPeriod,
					addTokenTimeLockInBlocks,
					initialSupply,
				};
				try {
					await this.createSmartPool({
						poolParams,
						crpParams,
						rights,
					});
					this.$router.push({ name: "home" });
				} catch (e) {
					console.error(e);
				}
			}
			this.loading = false;
		},
		async handleClick() {
			if (this.step === "proxy") return this.handleCreateProxy();
			if (this.step === "approval") return this.handleApprove();
			if (!this.step) return this.$emit("submit");
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

		createPool() {},
		addToken() {
			console.log(164, config.tokens);
			console.log(165, this.tokenFilterList);

			const anotherToken = getAnotherToken(
				config.tokens,
				this.tokenFilterList
			);
			this.tokenFilterList.push(anotherToken);
			// const tokenFilterList = this.tokenFilterList;
			this.$store.commit("TOKEN_FILTER_LIST", this.tokenFilterList);
			this.weights = "";
			this.amounts = "";
		},
		changeToken(selectedToken) {
			const tokenAddress = addressEq(selectedToken);
			console.log(tokenAddress);
			// Vue.set(this.tokenFilterList, this.activeToken, tokenAddress);
			// Vue.set(this.weights, tokenAddress, "");
			// Vue.set(this.amounts, tokenAddress, "");
		},
		validator(val) {
			return val ? val.length >= 1 && val !== "0" : false;
		},
	},
};
</script>
