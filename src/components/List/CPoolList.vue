<template>
	<CCol col="12" xl="12">
		<CCard>
			<CCardBody>
				<CDataTable
					:items="tokenFilterList"
					:fields="fields"
					:items-per-page="15"
					:active-page="activePage"
					:pagination="{ doubleArrows: false, align: 'center' }"
					@page-change="pageChange"
				>
					<template slot="assets" slot-scope="{ item }">
						<td>
							<img
								class="mr-2"
								:src="item.logoURL"
								style="
									width: 28px;
									height: 28px;
									border-radius: 35px;
									background-color: #d7d7d7;
								"
								alt=""
							/>
							{{ item.symbol !== "" ? item.symbol : "Select" }}
							<CButton
								color="light"
								variant="ghost"
								@click="selectAsset(item)"
							>
								<CIcon size="sm" name="cil-caret-bottom" />
							</CButton>
						</td>
					</template>
					<template slot="myBalance" slot-scope="{ item }">
						<td>{{ getBalance(item.address) }}</td>
					</template>
					<template slot="weights" slot-scope="{ item }">
						<td>
							<div
								class="text-center d-flex justify-content-start"
							>
								<CInput
									type="number"
									v-model="item.weights"
									@input="
										handleWeightChange(item.address, item)
									"
								/>
							</div>
						</td>
					</template>
					<template slot="percent" slot-scope="{ item }">
						<td>
							{{
								_num(
									getPercentage(item.address, item) / 100,
									"percent"
								)
							}}
						</td>
					</template>
					<template slot="amount" slot-scope="{ item }">
						<td>
							<div
								class="text-center d-flex justify-content-start"
							>
								<CInput
									type="number"
									v-model="item.amounts"
									@input="
										handleAmountChange(item.address, item)
									"
								/>
							</div>
						</td>
					</template>
					<template slot="price" slot-scope="{ item }">
						<td>
							{{
								parseFloat(
									$store.state.price.values[item.address]
								).toFixed(2)
							}}
						</td>
					</template>
					<template slot="totalValue" slot-scope="{ item }">
						<td>
							{{ parseFloat(getValue(item.address)).toFixed(2) }}
						</td>
					</template>
					<template #remove="{ item, index }">
						<td class="py-2">
							<CButton
								color="primary"
								variant="outline"
								square
								size="sm"
								@click="removeItem(item, index)"
							>
								Remove
							</CButton>
						</td>
					</template>
				</CDataTable>
			</CCardBody>
		</CCard>
		<CModal
			:show.sync="selectAssetModal"
			:no-close-on-backdrop="true"
			:centered="true"
			title="Settings"
			size="lg"
			color="dark"
		>
			<CCol xs="12" md="12">
				<CCard>
					<confTokenTable
						:inputType="inputType"
						:tokenFilterList="tokenFilterList"
						:listData="listData"
						@filterData="filterData"
					></confTokenTable>
				</CCard>
			</CCol>
			<template #header>
				<h6 class="modal-title">Settings</h6>
				<CButtonClose
					@click="selectAssetModal = false"
					class="text-white"
				/>
			</template>
			<template #footer>
				<div></div>
				<!-- <CButton @click="selectAssetModal = false" color="danger"
					>Discard</CButton
				>
				<CButton @click="selectAssetModal = false" color="success"
					>Accept</CButton
				> -->
			</template>
		</CModal>
	</CCol>
</template>

<script>
import Vue from "vue";
// import { mapActions } from 'vuex';
import confTokenTable from "../../components/Tables/confTokenTable";
import { normalizeBalance, bnum } from "@/lib/utils";
// import vettedTokenList from "@/config/vetted_tokenlist";

export default {
	name: "ListPool",
	props: {
		fields: { type: Array },
		tokenFilterList: { type: Array },
		weights: { type: Object },
	},
	data() {
		return {
			activePage: 1,
			inputType: "",
			selectAssetModal: false,
			filterTokenData: {},
			totalWeight: 0,
			amounts: {},
			listData: [],
			padlock: true,
		};
	},
	components: {
		confTokenTable,
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
		vettedTokenListData() {
			return this.$store.state.app.vettedTokenListData;
		},
		// pool() {
		// 	if (this.validationError) {
		// 		return;
		// 	}
		// 	const tokens = this.tokens.map((token) => {
		// 		return {
		// 			checksum: token,
		// 			weightPercent: this.getPercentage(token),
		// 		};
		// 	});
		// 	const swapFee = (parseFloat(this.swapFee) / 100).toString();
		// 	const liquidity = "0";
		// 	return {
		// 		tokens,
		// 		swapFee,
		// 		liquidity,
		// 	};
		// },
	},
	methods: {
		selectAsset(s) {
			this.filterTokenData = s;
			this.getListData();
			this.selectAssetModal = true;
		},
		getListData() {
			let vettedTokenListData = this.vettedTokenListData;
			let tokenFilterList = this.tokenFilterList;
			let set = tokenFilterList.map((item) => item.symbol);
			let resArr = vettedTokenListData.filter(
				(item) => !set.includes(item.symbol)
			);

			this.listData = resArr;
		},
		filterData(s) {
			console.log(this.tokenFilterList);
			this.tokenFilterList.map((item, index) => {
				if (item.symbol === this.filterTokenData.symbol) {
					this.tokenFilterList[index] = s;
					this.$store.commit(
						"TOKEN_FILTER_LIST",
						this.tokenFilterList
					);
					return this.tokenFilterList;
				}
			});
			this.filterTokenData = s;
			this.selectAssetModal = false;
		},
		getBalance(tokenAddress) {
			console.log(this.$store.state.web3.balances[tokenAddress]);
			console.log(
				this.$store.state.web3.tokenMetadata[tokenAddress].decimals
			);
			// const balance = normalizeBalance(
			// 	this.$store.state.web3.balances[tokenAddress],
			// 	this.$store.state.web3.tokenMetadata[tokenAddress].decimals
			// );
			let balance = this.$store.state.web3.balances[tokenAddress];
			const spstr = this.$store.state.web3.balances[tokenAddress].split(
				""
			);
			this.$store.state.price.si.filter((item) => {
				if (item.value === spstr[spstr.length - 1]) {
					console.log(item.power);
					balance =
						balance.substring(0, balance.length - 1) *
						Math.pow(10, item.power);
					return balance;
				}
			});
			return parseFloat(balance).toFixed(3);
		},

		getPercentage(token, item) {
			return this.totalWeight == 0
				? 0
				: (item.weights / this.totalWeight) * 100;
		},
		handleWeightChange(tokenAddress, item) {
			// console.log(tokenAddress, item);
			// console.log(this.tokenFilterList);
			this.handleAmountChange(tokenAddress, item);
		},

		handleAmountChange(tokenAddress, item) {
			const tokenPrice = this.$store.state.price.values[tokenAddress];
			if (!tokenPrice) {
				return;
			}
			const tokenValue = bnum(item.amounts).times(tokenPrice);
			const totalValue = tokenValue.div(item.weights);

			this.totalWeight = this.tokenFilterList.reduce((acc, token) => {
				// console.log(acc);
				// console.log(token);
				// const weight = parseFloat(item.weights[token.address]);
				const weight = parseFloat(token.weights);
				// console.log(weight);
				return acc + weight;
			}, 0);
			// console.log(this.totalWeight)

			for (const token of this.tokenFilterList) {
				if (token.address === tokenAddress || !this.padlock) {
					continue;
				}
				const tokenWeight = bnum(token.weights || "");
				if (totalValue.isNaN() || tokenWeight.isNaN()) {
					token.amounts = "";
					continue;
				}
				const tokenPrice = this.$store.state.price.values[
					token.address
				];
				if (!tokenPrice) {
					continue;
				}
				// console.log(123123321111111111111111111111);
				const tokenValue = tokenWeight.times(totalValue);
				const tokenAmount = tokenValue.div(tokenPrice);
				console.log(tokenAmount.toString());
				token.amounts = tokenAmount.toString();
			}
		},
		getValue(tokenAddress) {
			const tokenPrice = this.$store.state.price.values[tokenAddress];
			if (!tokenPrice || !this.amounts[tokenAddress]) {
				return 0;
			}
			return bnum(this.amounts[tokenAddress])
				.times(tokenPrice)
				.toFixed(2);
		},
		removeItem(s) {
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
			this.tokenFilterList.map((token) => {
				this.handleWeightChange(token.address);
			});
			this.tokenFilterList.remove(s);
			this.$store.commit("TOKEN_FILTER_LIST", this.tokenFilterList);
		},
		pageChange(val) {
			this.$router.push({ query: { page: val } });
		},
	},
};
</script>
