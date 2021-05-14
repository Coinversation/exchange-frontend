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
					@click="(alert1 = false), (disabled = false)"
				>
					I agree
				</CButton>
			</CAlert>

			<CCol col="1">
				<CButton
					color="primary"
					style="color: #ffffff"
					@click="createPool"
					size="lg"
					:disabled="disabled"
				>
					Create
					<!-- Unlock USDC -->
				</CButton>
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
import CPoolList from "../../components/List/CPoolList";
import { getTokenBySymbol } from "@/lib/utils";
import { addressEq } from "@polkadot/util-crypto";

import config from "@/config";

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
			disabled: true,
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
		};
	},
	components: {
		CPoolList,
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
		tokenFilterList() {
			return this.$store.state.app.tokenFilterList;
		},
	},
	created() {
		const dai = getTokenBySymbol("DAI");
		const usdc = getTokenBySymbol("USDC");
		const tokenFilterList = [dai, usdc];
		this.$store.commit("TOKEN_FILTER_LIST", tokenFilterList);
		this.weights = "";
		this.amounts = "";
		this.loading = false;
	},
	methods: {
		createPool() {},
		addToken() {
			console.log(164, config.tokens);
			console.log(165, this.tokenFilterList);

			const anotherToken = getAnotherToken(
				config.tokens,
				this.tokenFilterList
			);
			this.tokenFilterList.push(anotherToken);
			const tokenFilterList = this.tokenFilterList;
			this.$store.commit("TOKEN_FILTER_LIST", tokenFilterList);
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
