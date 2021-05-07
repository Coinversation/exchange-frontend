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
							v-if="tokens.length < 5"
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
				<CPoolList :tokens="tokens" :fields="fields" />
				<CCardHeader>
					<h4>Swap fee (%)</h4>
					<CCol col="2">
						<CInput width="20px"></CInput>
					</CCol>
				</CCardHeader>
			</CCard>
			<CCol col="1">
				<CButton
					color="primary"
					style="color: #ffffff"
					@click="createPool"
					size="lg"
				>
					Create</CButton
				>
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
// import poolListData from "../../mock/poolListDataShared";
import vettedTokenList from "../../config/vetted_tokenlist";
// import poolListData from "../../mock/poolListDataPrivate";
import CPoolList from "../../components/List/CPoolList";
import { getTokenBySymbol } from "@/lib/utils";
import { addressEq } from "@polkadot/util-crypto";

import config from "@/config";

function getAnotherToken(tokens, selectedTokens) {
	const tokenAddresses = Object.keys(tokens);
	for (const tokenAddress of tokenAddresses) {
		const token = tokens[tokenAddress];
		if (token.symbol === "DOT") {
			console.log(123);
			continue;
		}
		if (!selectedTokens.includes(token.address)) {
			console.log(token.address);
			return token;
		}
	}
}

export default {
	name: "Users",
	data() {
		return {
			vettedTokenListData: vettedTokenList.tokens,
			darkModal: false,
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
			tokens: [],
			amounts: {},
			weights: {},
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
	created() {
		// Initialize an (arbitrary) two-token pool, with weights
		const dai = getTokenBySymbol("DAI");
		const usdc = getTokenBySymbol("USDC");
		this.tokens = [dai, usdc];
		// weights contain percentage values - denorms are calculated later
		// Vue.set(this.weights, dai, "60");
		// Vue.set(this.weights, usdc, "40");
		this.weights = "";
		this.amounts = "";
		this.loading = false;
	},
	methods: {
		getBadge(status) {
			switch (status) {
				case "Active":
					return "success";
				case "Inactive":
					return "secondary";
				case "Pending":
					return "warning";
				case "Banned":
					return "danger";
				default:
					"primary";
			}
		},
		createPool() {},
		addToken() {
			console.log(164, config.tokens);
			console.log(165, this.tokens);
			const anotherToken = getAnotherToken(config.tokens, this.tokens);
			this.tokens.push(anotherToken);
			this.weights = "";
			this.amounts = "";
		},
		changeToken(selectedToken) {
			const tokenAddress = addressEq(selectedToken);
			console.log(tokenAddress);
			// Vue.set(this.tokens, this.activeToken, tokenAddress);
			// Vue.set(this.weights, tokenAddress, "");
			// Vue.set(this.amounts, tokenAddress, "");
		},
		filterData(s) {
			console.log(193, s);
			this.tokens.push(s);
			this.darkModal = false;
			console.log(this.tokens);
		},
		removeFilter(s) {
			Array.prototype.indexOf = function (val) {
				for (var i = 0; i < this.length; i++) {
					if (this[i] == val) return i;
				}
				return -1;
			};
			Array.prototype.remove = function (val) {
				var index = this.indexOf(val);
				if (index > -1) {
					this.splice(index, 1);
				}
			};
			this.tokens.remove(s);
			console.log(this.filterTokenData);
		},
	},
};
</script>
